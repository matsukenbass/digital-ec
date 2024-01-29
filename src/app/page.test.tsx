import { test, expect } from '@playwright/experimental-ct-react';
import '@/components/MaxWidthWrapper';
import Home from './page';

test('初期表示', async ({ mount }) => {
  const component = await mount(<Home />);
  expect(component.getByText('Instant Delivery')).toBeTruthy();
});
