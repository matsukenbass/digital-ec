import { test, expect } from '../../__mocks__/testUtils';

const testMailAddress = process.env.TEST_ACCOUNT_MAIL ?? '';
const testPassword = process.env.TEST_ACCOUNT_PASSWORD ?? '';

test('ログインテスト', async ({ page }) => {
  await page.goto('/');

  const userAgent = await page.evaluate(() => navigator.userAgent);
  const isMobile = userAgent.includes('Mobile');

  if (isMobile) {
    await page.locator('header').getByRole('button').click();
  } else {
    await page.waitForSelector('role=link[name="Sign in"]', { state: 'visible' });
  }

  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByPlaceholder('you@example.com').click();
  await page.getByPlaceholder('you@example.com').fill(testMailAddress);
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(testPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000');

  await page.reload();
  await page.waitForLoadState();

  if (isMobile) {
    await page.locator('header').getByRole('button').click();
  }

  await page.getByRole('button', { name: 'My account' }).click();
  expect(await page.getByText(testMailAddress)).toBeVisible();

  await page.waitForTimeout(1000);
});
