import { Normalizer } from "../../src/utils/normalizer";

describe("Normalizer", () => {
  describe("normalizePath", () => {
    test.each([
      ["/api/v1/users/:userId", [], "#val", "/api/v1/users/:userId"],
      ["/api/v1/users/user124", [], "#val", "/api/v1/users/user124"],
      [
        "/api/v1/users/user-example",
        [/^(?!v\d$).*\d+.*$/],
        "#val",
        "/api/v1/users/user-example",
      ],
      [
        "/api/v1/users/user123",
        [/^(?!v\d$).*\d+.*$/],
        "#val",
        "/api/v1/users/#val",
      ],
      ["/api/v1/users/123", [], "#val", "/api/v1/users/#val"],
    ])(
      'normalizePath("%s", %s, "%s") should return "%s"',
      (url, patterns, replacement, expected) => {
        expect(Normalizer.normalizePath(url, patterns, replacement)).toBe(
          expected,
        );
      },
    );

    it("Should throw an error for an invalid URL", () => {
      expect(() =>
        Normalizer.normalizePath("invalid-url:", [], "#val"),
      ).toThrow();
    });
  });

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
