export const PRODUCT_CATEGORIES = [
  {
    label: 'Music',
    value: 'music' as const,
    featured: [
      {
        name: 'Editor picks',
        href: `/products?category=music`,
        imageSrc: '/nav/ui-kits/mixed.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=music&sort=desc',
        imageSrc: '/nav/ui-kits/blue.jpg',
      },
      {
        name: 'Bestsellers',
        href: '/products?category=music',
        imageSrc: '/nav/ui-kits/purple.jpg',
      },
    ],
  },
  {
    label: 'Books',
    value: 'books' as const,
    featured: [
      {
        name: 'Favorite Book Picks',
        href: `/products?category=books`,
        imageSrc: '/nav/icons/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=books&sort=desc',
        imageSrc: '/nav/icons/new.jpg',
      },
      {
        name: 'Bestselling Books',
        href: '/products?category=books',
        imageSrc: '/nav/icons/bestsellers.jpg',
      },
    ],
  },
];
