import { mockProductRes } from '../../__mocks__/mockData';
import { test, expect } from '../../__mocks__/testUtils';

test('商品表示テスト', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(await page.getByRole('link', { name: 'Browse Trending' })).toBeVisible();
  await page.getByRole('link', { name: 'Browse Trending' }).click();
  await page.waitForLoadState();

  for (const item of mockProductRes.items) {
    expect(await page.getByText(item.name)).toBeVisible();
  }

  // NOTE：最後のexpectの後は待つ必要あり
  await page.waitForTimeout(1000);

  // // TODO: server componentでもAPIをモックできるようにする
  // const productName =
  //   (await page
  //     .locator('h1')
  //     .filter({ hasText: mockRes.result.data.items[0].name })
  //     .textContent()) ?? '';
  // await page.getByRole('button', { name: '視聴する' }).click();
  // await page.waitForLoadState();
  // expect(await page.getByLabel('Playlist').getByText(productName)).toBeVisible();
});
