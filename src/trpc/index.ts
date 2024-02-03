import { authRouter } from './auth-router';
import { router } from './trpc';
import { paymentRouter } from './payment-router';
import { productRouter } from './product-router';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
