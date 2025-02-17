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

import { Normalizer } from "../../src/utils/normalizer";

describe("Normalizer", () => {
  describe("normalizeStatusCode", () => {
    test.each([
      [200, "2XX"],
      [299, "2XX"],
      [300, "3XX"],
      [399, "3XX"],
      [400, "4XX"],
      [499, "4XX"],
      [500, "5XX"],
      [599, "5XX"],
    ])('normalizeStatusCode(%d) should return "%s"', (statusCode, expected) => {
      expect(Normalizer.normalizeStatusCode(statusCode)).toBe(expected);
    });
  });
});
