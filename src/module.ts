import { ApiTags } from "@byndyusoft/nest-swagger";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import {
  makeHistogramProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";

import {
  DEFAULT_BUCKETS,
  DEFAULT_HTTP_REQUESTS_METRIC_NAME,
  DEFAULT_PROM_OPTIONS,
} from "./constants";
import { InboundInterceptor } from "./interceptor";
import { PromModuleOptions } from "./interfaces";

@Global()
@Module({})
export class PromModule {
  public static forRoot(options: PromModuleOptions = {}): DynamicModule {
    const registryOptionsProvider = {
      provide: DEFAULT_PROM_OPTIONS,
      useValue: options,
    };

    const buckets: number[] =
      options.httpRequestBucket?.timeBuckets ?? DEFAULT_BUCKETS;

    const metricProvider = makeHistogramProvider({
      name: DEFAULT_HTTP_REQUESTS_METRIC_NAME,
      help: "HTTP requests - Duration in seconds",
      labelNames: ["method", "status", "path"],
      buckets,
    });

    const registryInterceptorProvider = options.httpRequestBucket?.enable
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: InboundInterceptor,
          },
          metricProvider,
          registryOptionsProvider,
          Reflector,
        ]
      : [];

    const dynamicModule = PrometheusModule.register({
      path: "/metrics",
    });

    const controller = dynamicModule.controllers?.[0];

    if (controller && options.apiTag) ApiTags(options.apiTag)(controller);

    return {
      module: PromModule,
      imports: [dynamicModule],
      providers: [...registryInterceptorProvider],
      exports: [PrometheusModule, PromModule],
    };
  }
}
