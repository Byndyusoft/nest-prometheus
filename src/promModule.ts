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

import { ApiTags } from "@byndyusoft/nest-swagger";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import {
  makeHistogramProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";

import {
  DEFAULT_BUCKETS,
  DEFAULT_HTTP_REQUESTS_METRIC_NAME,
  DEFAULT_METRIC_PATH,
  DEFAULT_PROM_OPTIONS_TOKEN,
} from "./constants";
import { PromModuleOptions } from "./interfaces";
import { PromInterceptor } from "./promInterceptor";

@Global()
@Module({})
export class PromModule {
  public static register(options: PromModuleOptions): DynamicModule {
    const registryInterceptorProvider = options.httpRequestBucket?.enable
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: PromInterceptor,
          },
          makeHistogramProvider({
            name: DEFAULT_HTTP_REQUESTS_METRIC_NAME,
            help: "HTTP requests - Duration in seconds",
            labelNames: ["method", "status", "path"],
            buckets: options.httpRequestBucket.timeBuckets ?? DEFAULT_BUCKETS,
          }),
          {
            provide: DEFAULT_PROM_OPTIONS_TOKEN,
            useValue: options,
          },
        ]
      : [];

    const dynamicModule = PrometheusModule.register({
      path: options.metricPath ?? DEFAULT_METRIC_PATH,
    });

    const controller = dynamicModule.controllers?.[0];

    if (controller && options.apiTag) ApiTags(options.apiTag)(controller);

    return {
      module: PromModule,
      imports: [dynamicModule],
      providers: registryInterceptorProvider,
      exports: [PrometheusModule, PromModule],
    };
  }
}
