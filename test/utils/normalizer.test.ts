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
