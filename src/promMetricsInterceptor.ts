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
  DEFAULT_PROM_OPTIONS,
} from "./constants";
import { PromModuleOptions } from "./interfaces";
import { Normalizer } from "./utils";

@Injectable()
export class InboundInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    @Inject(DEFAULT_PROM_OPTIONS) private readonly options: PromModuleOptions,
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

    const startTime = Date.now();

    const processResponse = (statusCode: number): void => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const request = context.switchToHttp().getRequest<Request>();

      const controllerPathIndex = request.url.indexOf(controllerPath);
      const prefixPath =
        controllerPathIndex === -1
          ? ""
          : request.url.slice(0, controllerPathIndex);

      const fullPath = `${prefixPath}${controllerPath}${methodPath}`;

      const { method } = request;
      const path = Normalizer.normalizePath(
        fullPath,
        this.options.httpRequestBucket?.pathNormalizationExtraMasks as RegExp[],
        "#val",
      );

      if (
        path === "/favicon.ico" ||
        path === this.options.customUrl ||
        path === this.options.metricPath
      ) {
        return;
      }

      const status = Normalizer.normalizeStatusCode(statusCode);

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
