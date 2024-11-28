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
     * Additional masks for requests paths normalization
     */
    pathNormalizationExtraMasks?: RegExp[];

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
