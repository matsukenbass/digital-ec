'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PRODUCT_CATEGORIES } from '@/config';
import { useCart } from '@/hooks/use-cart';
import { cn, formatPrice } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { items, removeItem } = useCart();
  const router = useRouter();
  const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) router.push(url);
    },
  });

  const productIds = useMemo(() => items.map(({ product }) => product.id), [items]);
  const fee = 1;

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const cartTotal = useMemo(
    () => items.reduce((total, { product }) => total + product.price, 0),
    [items]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemoveItem = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          カート内の商品
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn('lg:col-span-7', {
              'rounded-lg border-2 border-dashed border-zinc-200 p-12':
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>
            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div aria-hidden="true" className="relative mb-4 h-40 w-40 text-muted-foreground">
                  <Image
                    src="/hippo-empty-cart.png"
                    fill
                    sizes="100vw"
                    loading="eager"
                    alt="empty shopping cat hippo"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-center text-muted-foreground">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}
            <ul
              className={cn({
                'divide-y divide-gray-200 border-b border-t border-gray-200':
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product }) => {
                  const label = PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label;
                  const { image } = product.images[0];
                  return (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="shrink-0">
                        <div className="relative h-24 w-24">
                          {typeof image !== 'string' && image.url ? (
                            <Image
                              fill
                              sizes="100vw"
                              src={image.url}
                              alt="product image"
                              className="h-full w-full rounded-md object-center sm:h-48 sm:w-48"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/product/${product.id}`}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">Category: {label}</p>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <div className="mt-4 w-20 sm:mt-0 sm:pr-9">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                onClick={() => handleRemoveItem(product.id)}
                                variant="ghost"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          <Check className="h-5 w-5 shrink-0 text-green-500" />
                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium">注文サマリー</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">小計</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>手数料</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">合計</div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                className="w-full"
                size="lg"
                onClick={() => createCheckoutSession({ productIds })}
                disabled={items.length === 0 || isLoading}
              >
                {isLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
                支払画面に進む
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
