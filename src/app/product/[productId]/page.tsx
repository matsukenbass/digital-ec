import AddToCartButton from '@/components/AddToCartButton';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import PlayerModal from '@/components/PlayerModal';
import { PRODUCT_CATEGORIES } from '@/config';
import { getPayloadClient } from '@/get-payload';
import { formatPrice } from '@/lib/utils';
import { Check, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Audio } from '../../../payload-types';
import { getDataById } from '@/lib/dynamodb';
import { lazy, Suspense } from 'react';

const LazyImageSlider = lazy(() => import('@/components/ImageSlider'));

interface PageProps {
  params: {
    productId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
];

const Page = async ({ params }: PageProps) => {
  const { productId } = params;
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: 'approved',
      },
    },
  });
  const [product] = products;
  const audioFilenameList = product.playlist
    ? product.playlist.map((item) => {
        return (item.audio as Audio).filename as string;
      })
    : [];
  const originalFilenameList = product.playlist
    ? product.playlist.map((item) => {
        return (item.audio as Audio).originalFilename as string;
      })
    : [];

  if (!product) return notFound(); //404

  const validUrls = product.images
    .map(({ image }) => (typeof image === 'string' ? image : image.url))
    .filter(Boolean) as string[];

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label;

  const results: any = [];
  for (const item of audioFilenameList) {
    const result: any = await getDataById(item);
    results.push(result[0]);
  }

  const extractSValues = (obj: Record<string, { S: string }>): { [k: string]: string } => {
    const keys = Object.keys(obj);
    const vals = Object.values(obj).map((value) => value.S);
    const data = Object.fromEntries(keys.map((key, index) => [key, vals[index]]));
    return data;
  };

  const metadata = results.map((item: Record<string, { S: string }>) => {
    const extracted = extractSValues(item);
    return { ...extracted, original: originalFilenameList[results.indexOf(item)] };
  });

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="text-sm font-medium text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>
            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                <div className="ml-4 border-l border-gray-300 pl-4 text-muted-foreground">
                  {label}
                </div>
              </div>
              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">{product.description}</p>
              </div>
              <div className="mt-6 flex items-center">
                <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-green-500" />
                <p className="ml-2 text-sm text-muted-foreground">Eligible instant delivery</p>
              </div>
              <div>
                {audioFilenameList.length !== 0 ? (
                  <PlayerModal
                    validUrls={validUrls}
                    audioFilenameList={audioFilenameList}
                    originalFilenameList={originalFilenameList}
                    productName={product.name}
                    productOwner={
                      typeof product?.user !== 'string'
                        ? product?.user?.email.split('@')[0] ?? 'Jane Doe'
                        : product?.user ?? 'Jane Doe'
                    }
                    metadata={metadata}
                  />
                ) : null}
              </div>
            </section>
          </div>
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <Suspense fallback={<div>Loading...</div>}>
                <LazyImageSlider urls={validUrls}></LazyImageSlider>
              </Suspense>
            </div>
          </div>
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div className="mt-10">
              <AddToCartButton product={product}></AddToCartButton>
            </div>
            <div className="mt-6 text-center">
              <div className="group inline-flex text-sm font-medium">
                <Shield aria-hidden="true" className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
                <span className="text-muted-foreground hover:text-gray-700">
                  30 Day Return Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
