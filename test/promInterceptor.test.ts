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

import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { Request } from "express";
import { Histogram } from "prom-client";
import { of } from "rxjs";

import {
  DEFAULT_HTTP_REQUESTS_METRIC_NAME,
  DEFAULT_IGNORED_URLS,
  DEFAULT_PROM_OPTIONS_TOKEN,
} from "../src";
import { PromInterceptor } from "../src/promInterceptor";

const mockOptions = {
  httpRequestBucket: {
    ignoredUrls: DEFAULT_IGNORED_URLS,
  },
};

describe("PromInterceptor", () => {
  let interceptor: PromInterceptor;
  let mockHistogram: Histogram;
  let mockReflector: Reflector;

  beforeEach(async () => {
    mockHistogram = {
      observe: jest.fn(),
    } as unknown as jest.Mocked<Histogram>;

    mockReflector = new Reflector();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromInterceptor,
        { provide: Reflector, useValue: mockReflector },
        { provide: DEFAULT_PROM_OPTIONS_TOKEN, useValue: mockOptions },
        {
          provide: `PROM_METRIC_${DEFAULT_HTTP_REQUESTS_METRIC_NAME.toUpperCase()}`,
          useValue: mockHistogram,
        },
      ],
    }).compile();

    interceptor = module.get<PromInterceptor>(PromInterceptor);
  });

  test.each([
    [
      {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        url: "/api/v1/users/1",
        controller: "users",
        method: ":user:",
        // eslint-disable-next-line sonarjs/no-duplicate-string
        resultPath: "/api/v1/users/:user:",
      },
    ],
    [
      {
        url: "/api/v1/users/1",
        controller: "/users",
        method: ":user:",
        resultPath: "/api/v1/users/:user:",
      },
    ],
    [
      {
        url: "/api/v1/users/1",
        controller: "users",
        method: "/:user:",
        resultPath: "/api/v1/users/:user:",
      },
    ],
    [
      {
        url: "/example",
        controller: "",
        method: "example",
        resultPath: "/example",
      },
    ],
    [
      {
        url: "/example",
        controller: "",
        method: "/example",
        resultPath: "/example",
      },
    ],
    [
      {
        url: "/example",
        controller: "/",
        method: "example",
        resultPath: "/example",
      },
    ],
    [
      {
        url: "/example",
        controller: "/",
        method: "/example",
        resultPath: "/example",
      },
    ],
  ])("should observe metrics with %s", async (data) => {
    jest.spyOn(mockReflector, "get").mockImplementation((key, target) => {
      if (key === "path") {
        if (target.name === data.controller) return data.controller;
        if (target.name === data.method) return data.method;
      }
      return "";
    });

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: (): Partial<Request> => ({
          url: data.url,
          method: "GET",
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
      getHandler: jest.fn().mockReturnValue({ name: data.method }),
      getClass: jest.fn().mockReturnValue({ name: data.controller }),
    };

    const next = {
      handle: jest.fn().mockReturnValue(of("response")),
    };

    await new Promise<void>((resolve) => {
      interceptor.intercept(mockContext as ExecutionContext, next).subscribe({
        complete() {
          return resolve();
        },
      });
    });

    expect(next.handle).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockHistogram.observe).toHaveBeenCalledWith(
      { method: "GET", status: "2XX", path: data.resultPath },
      expect.any(Number),
    );
  });

  test.each([
    [{ url: "/_healthz", controller: "", method: "_healthz" }],
    [{ url: "/_healthz", controller: "", method: "/_healthz" }],
    [{ url: "/_healthz", controller: "/", method: "_healthz" }],
    [{ url: "/_healthz", controller: "/", method: "/_healthz" }],
  ])("should ignored observe metrics with %s", async (data) => {
    jest.spyOn(mockReflector, "get").mockImplementation((key, target) => {
      if (key === "path") {
        if (target.name === data.controller) return data.controller;
        if (target.name === data.method) return data.method;
      }
      return "";
    });

    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: (): Partial<Request> => ({
          url: data.url,
          method: "GET",
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
      getHandler: jest.fn().mockReturnValue({ name: data.method }),
      getClass: jest.fn().mockReturnValue({ name: data.controller }),
    };

    const next = {
      handle: jest.fn().mockReturnValue(of("response")),
    };

    await new Promise<void>((resolve) => {
      interceptor.intercept(mockContext as ExecutionContext, next).subscribe({
        complete() {
          return resolve();
        },
      });
    });

    expect(next.handle).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockHistogram.observe).not.toHaveBeenCalled();
  });
});
