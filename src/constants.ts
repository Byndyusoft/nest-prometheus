export const DEFAULT_METRIC_PATH = "/metrics";
export const DEFAULT_HTTP_REQUESTS_METRIC_NAME = "http_requests";
export const DEFAULT_BUCKETS = [
  0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10,
];
export const DEFAULT_IGNORED_URLS = [
  DEFAULT_METRIC_PATH,
  "/_readiness",
  "/_healthz",
  "/favicon.ico",
];
