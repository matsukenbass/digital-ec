import { authRouter } from './auth-router';
import { router } from './trpc';
import { paymentRouter } from './payment-router';
import { productRouter } from './product-router';

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
