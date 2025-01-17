/*
 * Copyright 2024 Byndyusoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Request, Response } from "express";
import { Histogram } from "prom-client";
import { catchError, Observable, of, tap } from "rxjs";

import {
  DEFAULT_HTTP_REQUESTS_METRIC_NAME,
  DEFAULT_IGNORED_URLS,
  DEFAULT_PROM_OPTIONS_TOKEN,
  TRIM_SLASHES_PATTERN,
} from "./constants";
import { PromModuleOptions } from "./interfaces";
import { Normalizer } from "./utils";

@Injectable()
export class PromInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    @Inject(DEFAULT_PROM_OPTIONS_TOKEN)
    private readonly options: PromModuleOptions,
    @InjectMetric(DEFAULT_HTTP_REQUESTS_METRIC_NAME)
    private readonly histogram: Histogram,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const handler = context.getHandler();
    const controller = context.getClass();

    const controllerPath = this.reflector.get<string>("path", controller);
    const methodPath = this.reflector.get<string>("path", handler);

    const startTime = performance.now();

    const processResponse = (statusCode: number): void => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const request = context.switchToHttp().getRequest<Request>();

      const controllerPathIndex = request.url.indexOf(
        controllerPath.replace(TRIM_SLASHES_PATTERN, ""),
      );
      const prefixPath =
        controllerPathIndex === -1
          ? ""
          : request.url.slice(0, controllerPathIndex);

      const path = `${prefixPath}${controllerPath.replace(TRIM_SLASHES_PATTERN, "")}/${methodPath.replace(TRIM_SLASHES_PATTERN, "")}`;

      const ignoredUrls =
        this.options.httpRequestBucket?.ignoredUrls ?? DEFAULT_IGNORED_URLS;
      if (ignoredUrls.includes(path)) return;

      const status = Normalizer.normalizeStatusCode(statusCode);
      const { method } = request;

      const labels = { method, status, path };
      this.histogram.observe(labels, duration / 1000);
    };

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        processResponse(response.statusCode);
      }),
      catchError((error) => {
        if (error instanceof HttpException) {
          const statusCode = error.getStatus();
          processResponse(statusCode);
        }

        return of(error);
      }),
    );
  }
}
