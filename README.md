# nest-prometheus

[![npm@latest](https://img.shields.io/npm/v/@byndyusoft/nest-prometheus/latest.svg)](https://www.npmjs.com/package/@byndyusoft/nest-prometheus)
[![test](https://github.com/Byndyusoft/nest-prometheus/actions/workflows/test.yaml/badge.svg?branch=master)](https://github.com/Byndyusoft/nest-prometheus/actions/workflows/test.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

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
        // Default time buckets is 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10
        timeBuckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10],
        // Default ignored urls is /metrics, /_readiness, /_healthz, /favicon.ico
        ignoredUrls: ['/mymetric', '/favicon.ico']
    },
    apiTag: 'Infrastructure',
    // Default metric path is /metrics
    metricPath: '/mymetric'
}),
```

## Maintainers

- [@Byndyusoft/owners](https://github.com/orgs/Byndyusoft/teams/owners) <<github.maintain@byndyusoft.com>>
- [@Byndyusoft/team](https://github.com/orgs/Byndyusoft/teams/team)
- [@tykachev](https://github.com/tykachev)

## License

This repository is released under version 2.0 of the
[Apache License](https://www.apache.org/licenses/LICENSE-2.0).
