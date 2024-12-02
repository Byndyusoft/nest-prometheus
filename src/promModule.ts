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
