# nest-prometheus

## Requirements

- Node.js v16 LTS or later
- npm or yarn

## Install

```bash
npm install 'nest-prometheus@https://github.com/Byndyusoft/nest-prometheus.git'
//TODO npm install @byndyusoft/nest-prometheus
```

or

```bash
yarn add 'nest-prometheus@https://github.com/Byndyusoft/nest-prometheus.git'
//TODO yarn add @byndyusoft/nest-prometheus
```

## Usage

```typescript
import { Module } from "@nestjs/common";
import { PromModule } from "nest-prometheus";
//TODO import { PromModule } from '@byndyusoft/nest-prometheus'

@Module({
  imports: [
    PromModule.forRoot({
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
PromModule.forRoot({
    httpRequestBucket: {
        enable: true,
        timeBuckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10],
        pathNormalizationExtraMasks: [/^(?!v\d$).*\d+.*$/]
    },
    apiTag: 'Infrastructure'
}),
```
