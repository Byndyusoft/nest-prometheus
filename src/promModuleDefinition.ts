import { ConfigurableModuleBuilder } from "@nestjs/common";

import { PromModuleOptions } from "./interfaces/promModuleOptions";

export const { ConfigurableModuleClass, OPTIONS_TYPE, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PromModuleOptions>().build();
