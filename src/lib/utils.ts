import { type ClassValue, clsx } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'JPY' | 'USD' | 'EUR' | 'GBP' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'JPY', notation = 'compact' } = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 4,
  }).format(numericPrice);
}

export function constructMetadata({
  title = 'makemoke - the marketplace for digital assets',
  description = 'makemoke is an open-source marketplace for high-quality digital goods.',
  image = '/asset/logo.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@matsukenbass',
    },
    icons,
    metadataBase: new URL('https://digital-ec-matsukenbass.koyeb.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
