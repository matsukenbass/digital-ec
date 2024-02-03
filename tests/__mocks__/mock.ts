import type { RouterInput, RouterOutput } from '@/trpc';
import { HttpResponse, http } from 'next/experimental/testmode/playwright/msw';

export const trpcMswHandlerFactory = <
  K1 extends keyof RouterInput,
  K2 extends keyof RouterInput[K1], // object itself
  O extends RouterOutput[K1][K2] // all its keys
>(endpoint: {
  path: [K1, K2];
  response: O;
  type?: 'query' | 'mutation';
}) => {
  const fn = endpoint.type === 'mutation' ? http.post : http.get;
  const route = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc/${String(endpoint.path[0])}.${
    endpoint.path[1] as string
  }`;
  return fn(route, () => {
    return HttpResponse.json({ result: { data: endpoint.response } });
  });
};
