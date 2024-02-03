import { expect } from 'next/experimental/testmode/playwright';
import type { MockServiceWorker } from 'playwright-msw';
import { http, test as base } from 'next/experimental/testmode/playwright/msw';
import { createWorkerFixture } from 'playwright-msw';
import handlers from './handlers';
const test = base.extend<{
  worker: MockServiceWorker;
  http: typeof http;
}>({
  worker: createWorkerFixture(handlers),
  http,
});

export { expect, test };
