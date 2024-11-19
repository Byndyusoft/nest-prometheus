declare module "url-value-parser" {
  interface ValueDetectorOptions {
    extraMasks?: RegExp[];
  }

  class UrlValueParser {
    public constructor(options?: ValueDetectorOptions);
    public replacePathValues(path: string, replacement: string): string;
  }

  export default UrlValueParser;
}
