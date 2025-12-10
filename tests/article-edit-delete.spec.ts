import { test, expect } from '@playwright/test';
import { signUpAndLogin } from './helpers/auth';

test.describe('Edit / Delete Article', () => {
  test('Author can edit and delete article', async ({ page }) => {
    // 1️⃣ Sign up and login
    const { username } = await signUpAndLogin(page);
    const nav = page.locator('nav');

    // 2️⃣ create a new article
    const originalTitle = `Article for edit/delete ${Date.now()}`;
    const originalDescription = 'Original description';
    const originalBody = 'Original article body';
    const originalTags = 'original tag1';

    await nav.getByRole('link', { name: /new article/i }).click();

    await page.getByPlaceholder('Article Title').fill(originalTitle);
    await page
      .getByPlaceholder(`What's this article about?`)
      .fill(originalDescription);
    await page
      .getByPlaceholder('Write your article (in markdown)')
      .fill(originalBody);

    const publishButton = page.getByRole('button', { name: /publish article/i });
    await expect(publishButton).toBeEnabled();
    await publishButton.click();

    // checking article 
    await nav.getByRole('link', { name: username }).click();
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('body')).toContainText(originalTitle);

    // 3️⃣ open article
    await page.getByText(originalTitle).click();

    await expect(page.locator('h1')).toHaveText(originalTitle);
    await expect(page.locator('body')).toContainText(originalBody);

    // 4️⃣ update article
    const editButton = page.getByRole('button', { name: /edit article/i }).first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    const updatedBody = 'Updated article body content';
    const updatedTags = 'updated tag1 tag2';

    await page
      .getByPlaceholder('Write your article (in markdown)')
      .fill(updatedBody);

    const republishButton = page.getByRole('button', { name: /publish article/i });
    await expect(republishButton).toBeEnabled();
    await republishButton.click();

    // After republishing:
    await page.getByRole('link', { name: /home/i }).click(); // or go via profile
    await page.getByText(originalTitle).click();             // open article card

    await expect(page.locator('h1')).toHaveText(originalTitle);
    await expect(page.locator('body')).toContainText(updatedBody);


    // 5️⃣ delete article
    const deleteButton = page
      .getByRole('button', { name: /delete article/i }).nth(1);
    await deleteButton.click();

    await expect(page).toHaveURL(/.*(#\/)?/);

    // checking article is deleted
    await nav.getByRole('link', { name: username }).click();
    await expect(page).toHaveURL(/.*profile/);

    // checking title is not visible
    await expect(page.locator('body')).not.toContainText(originalTitle);
  });
});
