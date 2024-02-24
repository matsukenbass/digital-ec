'use client';

import { PRODUCT_CATEGORIES } from '@/config';
import { useEffect, useRef, useState, useCallback } from 'react';
import NavItem from './NavItem';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const isAnyOpen = activeIndex !== null;
  const navRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [close]);
  useOnClickOutside(navRef, close);

  const handleOpen = useCallback(
    (index: number) => () => {
      setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    },
    []
  );

  return (
    <div className="flex h-full gap-4" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        const isOpen = i === activeIndex;
        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen(i)}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
            close={close}
          />
        );
      })}
    </div>
  );
};
export default NavItems;
