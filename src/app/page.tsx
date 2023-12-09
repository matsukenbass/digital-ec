import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Image from 'next/image';

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col item-center max-w-3xl"></div>
    </MaxWidthWrapper>
  );
}
