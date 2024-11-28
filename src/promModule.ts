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
} from "./constants";
import { PromInterceptor } from "./promInterceptor";
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from "./promModuleDefinition";

@Global()
@Module({})
export class PromModule extends ConfigurableModuleClass {
  public static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const registryOptionsProvider = {
      provide: MODULE_OPTIONS_TOKEN,
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
            useClass: PromInterceptor,
          },
          metricProvider,
          registryOptionsProvider,
        ]
      : [];

    const dynamicModule = PrometheusModule.register({
      path: options.metricPath ?? DEFAULT_METRIC_PATH,
    });

    const controller = dynamicModule.controllers?.[0];

    if (controller && options.apiTag) ApiTags(options.apiTag)(controller);

    return {
      ...super.register(options),
      imports: [dynamicModule],
      providers: [...registryInterceptorProvider],
      exports: [PrometheusModule, PromModule],
    };
  }
}
