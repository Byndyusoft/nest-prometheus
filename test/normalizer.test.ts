import { Normalizer } from "../src/utils/normalizers";

describe("Normalizer", () => {
  describe("normalizePath", () => {
    it("Must return the original URL", () => {
      expect(
        Normalizer.normalizePath("/api/v1/users/:userId", [], "#val"),
      ).toBe("/api/v1/users/:userId");
    });

    it("Must return the original URL.", () => {
      expect(
        Normalizer.normalizePath("/api/v1/users/user124", [], "#val"),
      ).toBe("/api/v1/users/user124");
    });

    it("Must return the original URL", () => {
      expect(
        Normalizer.normalizePath(
          "/api/v1/users/user-example",
          [/^(?!v\d$).*\d+.*$/],
          "#val",
        ),
      ).toBe("/api/v1/users/user-example");
    });

    it("Must return a URL with replacement values", () => {
      expect(
        Normalizer.normalizePath(
          "/api/v1/users/user123",
          [/^(?!v\d$).*\d+.*$/],
          "#val",
        ),
      ).toBe("/api/v1/users/#val");
    });

    it("Must return a URL with replacement values", () => {
      expect(Normalizer.normalizePath("/api/v1/users/123", [], "#val")).toBe(
        "/api/v1/users/#val",
      );
    });

    it("Must return error, if original URL is bad", () => {
      expect(() =>
        Normalizer.normalizePath("invalid-url:", [], "#val"),
      ).toThrow();
    });
  });

  describe("normalizeStatusCode", () => {
    it('Should return "2XX" for code 200-299', () => {
      expect(Normalizer.normalizeStatusCode(200)).toBe("2XX");
      expect(Normalizer.normalizeStatusCode(299)).toBe("2XX");
    });

    it('Should return "3XX" for code 300-399', () => {
      expect(Normalizer.normalizeStatusCode(300)).toBe("3XX");
      expect(Normalizer.normalizeStatusCode(399)).toBe("3XX");
    });

    it('Should return "4XX" for code 400-499', () => {
      expect(Normalizer.normalizeStatusCode(400)).toBe("4XX");
      expect(Normalizer.normalizeStatusCode(499)).toBe("4XX");
    });

    it('Should return "5XX" for code 500 and above', () => {
      expect(Normalizer.normalizeStatusCode(500)).toBe("5XX");
      expect(Normalizer.normalizeStatusCode(599)).toBe("5XX");
    });
  });
});
