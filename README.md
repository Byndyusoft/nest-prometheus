# nest-prometheus

This package is a module for NestJS.
It provides the `http_requests` metric for Prometheus, which measures the duration of HTTP requests, distributes them into time intervals (buckets), and counts the number of requests and their total duration.

- The metric includes filtering by path, request method, and response code.
- Data on request durations are collected and distributed into time intervals (buckets).
- The number of requests and their total duration are recorded.

## Requirements

- Node.js v20 LTS or later
- npm or yarn

## Install

```bash
npm install @byndyusoft/nest-prometheus
```

or

```bash
yarn add @byndyusoft/nest-prometheus
```

## Usage

```typescript
import { Module } from "@nestjs/common";
import { PromModule } from "@byndyusoft/nest-prometheus";

@Module({
  imports: [
    PromModule.register({
      httpRequestBucket: {
        enable: true,
      },
    }),
  ],
})
export class ApplicationModule {}
```

## Set custom options

```typescript
PromModule.register({
    httpRequestBucket: {
        enable: true,
        timeBuckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10],
        pathNormalizationExtraMasks: [/^(?!v\d$).*\d+.*$/],
        ignoredUrls: ['/mymetric', '/favicon.ico']
    },
    apiTag: 'Infrastructure',
    metricPath: '/mymetric'
}),
```
