export const PRODUCT_CATEGORIES = [
  {
    label: 'Music',
    value: 'music' as const,
    featured: [
      {
        name: 'Picks',
        href: `/products?category=music`,
        imageSrc: '/nav/music/mixed.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=music&sort=desc',
        imageSrc: '/nav/music/blue.jpg',
      },
      {
        name: 'Bestsellers',
        href: '/products?category=music',
        imageSrc: '/nav/music/purple.jpg',
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
        imageSrc: '/nav/books/picks.jpg',
      },
      {
        name: 'New Arrivals',
        href: '/products?category=books&sort=desc',
        imageSrc: '/nav/books/new.jpg',
      },
      {
        name: 'Bestselling Books',
        href: '/products?category=books',
        imageSrc: '/nav/books/bestsellers.jpg',
      },
    ],
  },
];
