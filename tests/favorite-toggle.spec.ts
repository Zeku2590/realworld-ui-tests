import { test, expect } from '@playwright/test';
import { signUpAndLogin } from './helpers/auth';

test.describe('Favourite Toggle', () => {
  test('User can favourite and unfavourite an article, counter updates', async ({ page }) => {
    // 1️⃣sign in
    const { username } = await signUpAndLogin(page);
    const nav = page.locator('nav');

    // 2️⃣ Create article
    const title = `Article for favorite ${Date.now()}`;
    await nav.getByRole('link', { name: /new article/i }).click();

    await page.getByPlaceholder('Article Title').fill(title);
    await page
      .getByPlaceholder(`What's this article about?`)
      .fill('Fav toggle test');
    await page
      .getByPlaceholder('Write your article (in markdown)')
      .fill('Favourite toggle test body');
    

    const publishButton = page.getByRole('button', { name: /publish article/i });
    await expect(publishButton).toBeEnabled();
    await publishButton.click();


    // checking article 
    // After Publish Article
// Go to profile or home and open the article card by title
   const nav1 = page.locator('nav');
   await nav1.getByRole('link', { name: username }).click();
   
    // favorite button
    const favouriteButton = page
      .locator('button:has(.ion-heart)').first();
      await expect(favouriteButton).toBeVisible();

    const initialText = await favouriteButton.innerText();
    console.log('Initial favourite button text:', initialText);

    // toggle favorite
    await favouriteButton.click();

    // asser that the text changed(counter updated)
    await expect(favouriteButton).not.toHaveText(initialText);
    // assertion
    await expect(favouriteButton).toContainText('1');

    // 5️⃣ click unfavorite
    const textAfterFav = await favouriteButton.innerText();
    await favouriteButton.click();
    await expect(favouriteButton).not.toHaveText(textAfterFav);

    // checking after clicking unfavorite
    await expect(favouriteButton).toContainText('0');
  });
});
