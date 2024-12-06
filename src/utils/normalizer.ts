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

export class Normalizer {
  public static normalizeStatusCode(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return "2XX";
    if (statusCode >= 300 && statusCode < 400) return "3XX";
    if (statusCode >= 400 && statusCode < 500) return "4XX";

    return "5XX";
  }
}
