import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowDownToLine, CheckCircle, Leaf } from 'lucide-react';
import Link from 'next/link';

const perks = [
  {
    name: '即納',
    Icon: ArrowDownToLine,
    description: '数秒でEメールに商品のダウンロードリンクが届き、すぐにダウンロードできます。',
  },
  {
    name: '品質保証',
    Icon: CheckCircle,
    description:
      '私たちのプラットフォーム上のすべての資産は、私たちの最高の品質基準を確保するために私たちのチームによって検証されています。ご不満ですか？30日間の返金保証を提供しています。',
  },
  {
    name: '環境保護',
    Icon: Leaf,
    description: '私たちは売上の1％を自然環境の保護と回復に寄付することを約束しています。',
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="text-green-600">デジタルオリジナルグッズ</span>のECサイトです。
          </h1>
          <p className="mt-6 max-w-prose text-lg text-muted-foreground">
            makemokeのすべてのグッズは、私たちのチームによって検証されます。最高の品質基準を保証します。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>

        <ProductReel
          query={{ sort: 'desc', limit: 4 }}
          href="/products?sort=recent"
          title="New Release"
        />
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="flex justify-center md:shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-900">
                    {<perk.Icon className="h-1/3 w-1/3" />}
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">{perk.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
