import { test, expect, type Page } from '@playwright/test';
import { loadConfig, type UserConfig } from '../utils/configLoader';

const cfg = loadConfig();

// 🔹user
async function login(page: Page, user: UserConfig) {
  await page.goto('/#/login');
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: /sign in/i }).click();

  const nav = page.locator('nav');
  await expect(nav.getByRole('link', { name: user.username })).toBeVisible();
}

// 🔹 Logout through Settings
async function logout(page: Page) {
  const nav = page.locator('nav');
  await nav.getByRole('link', { name: /settings/i }).click();
  await page.getByText('Or click here to logout.').click();
  await expect(nav.getByRole('link', { name: /sign in/i })).toBeVisible();
}
// 🔹 publich article
async function publishArticle(page: Page, articleTitle: string) {
  const nav1 = page.locator('nav');
  await nav1.getByRole('link', { name: /new article/i }).click();

  await page.getByPlaceholder('Article Title').fill(articleTitle);
  await page
    .getByPlaceholder(`What's this article about?`)
    .fill('Follow feed test');
  await page
    .getByPlaceholder('Write your article (in markdown)')
    .fill('Body for follow feed test');
  

  const publishButton = page.getByRole('button', { name: /publish article/i });
  await expect(publishButton).toBeEnabled();
  await publishButton.click();
  const nav = page.locator('nav');
  await page.locator('a[href="#/my-profile"]').click();
  await expect(page).toHaveURL(/.*my-profile/);


   // checking tab
   const user = cfg.users.userB;

   await expect(
    page.getByRole('article').getByRole('heading', { name: articleTitle })
      .or(page.locator('h1, h2, h3').filter({ hasText: articleTitle}))
   ).toBeVisible();
}
test.describe('Follow Feed', () => {
  test('User A follows User B and sees new article in Your Feed', async ({ page }) => {
    const userA = cfg.users.userA;
    const userB = cfg.users.userB;

    const articleTitle = `Follow feed article ${Date.now()}`;

    // 1️⃣ User A sign in and follow User B
    await login(page, userA);

    // open user B
    await page.goto(`/#/profile/${userB.username}`);

    // clicking follow button
    const followButton = page.getByRole('button', {
      name: new RegExp(`follow`, 'i'),
    });

    await expect(followButton).toBeVisible();
    await followButton.click();

    // unfollow button
    await expect(
      page.getByRole('button', { name: /unfollow/i })
    ).toBeVisible();

    // logout
    await logout(page);

    // 2️⃣ User B sign in and publish article
    await login(page, userB);
    await publishArticle(page, articleTitle);
    await logout(page);

    // 3️⃣ User A sign in and checking feed
    await login(page, userA);

    await page.goto('/#/');

    // clicking my feed 
    await page.getByText('My feed').click();
    await page.pause();

    // checking User B showing under User A feed
    await expect(page.locator('body')).toContainText(articleTitle);
  });
});
