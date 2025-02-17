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

export interface PromModuleOptions {
  /**
   * Enable http_request_bucket metric
   *
   * @default '[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10]'
   */
  httpRequestBucket?: {
    enable: boolean;

    /**
     * Buckets for requests duration seconds histogram
     *
     * @default '[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10]'
     */
    timeBuckets?: number[];

    /**
     * Set ignored Urls
     */
    ignoredUrls?: string[];
  };

  /**
   * Set api tag if you use @byndyusoft/nest-swagger
   */
  apiTag?: string;

  /**
   * Set metric path
   */
  metricPath?: string;
}
