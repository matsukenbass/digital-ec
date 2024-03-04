import { trpcMswHandlerFactory } from './mock';
import { mockProductRes } from './mockData';

/** A collection of handlers to be used by default for all tests. */
const handlers = [
  trpcMswHandlerFactory({
    path: ['product', 'getInfiniteProducts'],
    type: 'query',
    response: mockProductRes,
  }),
  trpcMswHandlerFactory({
    path: ['auth', 'signIn'],
    type: 'query',
    response: { success: true },
  }),
];

export default handlers;
