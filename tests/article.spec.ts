import { test, expect } from '@playwright/test';

test.describe('Auth flow', () => {
  const timestamp=Date.now();
  const username = `user${Date.now()}`;
  const email = `user${timestamp}@test.com`;
  const password = 'TestPassword123!';

  const articleTitle = `Test article ${timestamp}`;
  const articleDescription = 'Short description for this test article';
  const articleBody = 'This is the body of the test article.\nWritten by Playwright 🙂';
  const articleTags = 'playwright testing e2e';


  test('Write Article ', async ({ page }) => {

    // ✅ Sign up
    await page.goto('/');
    await page.click('text=Sign up');
    await page.fill('input[formcontrolname="username"]', username);
    await page.fill('input[formcontrolname="email"]', email);
    await page.fill('input[formcontrolname="password"]', password);
    await page.locator('button:has-text("Sign up")').click();

    // ✅ Check login success
    await expect(
    page.getByRole('button', { name: /sign in/i })
    ).toBeVisible();

    await page.fill('input[formcontrolname="email"]', email);
    await page.fill('input[formcontrolname="password"]', password);
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeEnabled({ timeout: 5000 });
    await signInButton.click();
    const nav = page.locator('nav');

    await expect(
    nav.getByRole('link', { name: username })
    ).toBeVisible();

  // Verify "New Article"
   const newArticleLink=nav.getByRole('link',{name:/new article/i});
    await expect(newArticleLink).toBeVisible();
    await newArticleLink.click();

    await expect(page).toHaveURL(/.*editor/);

    await expect(
    page.getByPlaceholder('Article Title')
  ).toBeVisible();

  await expect(
    page.getByPlaceholder('What\'s this article about?')
  ).toBeVisible();

  await expect(
    page.getByPlaceholder('Write your article (in markdown)')
  ).toBeVisible();

  await expect(
    page.getByPlaceholder('Enter tags')
  ).toBeVisible();

  // 5️⃣ Filling the form
  await page.getByPlaceholder('Article Title').fill(articleTitle);
  await page.getByPlaceholder(`What's this article about?`).fill(articleDescription);
  await page.getByPlaceholder('Write your article (in markdown)').fill(articleBody);
  

  // 6️⃣ (Publish Article)
    const publishButton = page.locator(
  'button.btn-primary',
  { hasText: 'Publish Article' }
);

    await expect(publishButton).toBeEnabled();
    await publishButton.click();
    await expect(page.locator('body'))
    .toContainText(/published successfully/i);



  // 7️⃣ Checking articles page
  await page.locator('a[href="#/my-profile"]').click();
  await expect(page).toHaveURL(/.*my-profile/);
  await expect(page.locator('h1')).toHaveText(articleTitle);

  // 8️⃣ open my profile
  await nav.getByRole('link', { name: username }).click();

  // checking that we have tab My Articles 
  await expect(
  page.getByRole('link', { name: `${username}'s Articles` })
).toBeVisible();


  // 9️⃣ Checking My Articles
  await expect(
    page.getByRole('article').getByRole('heading', { name: articleTitle })
      .or(page.locator('h1, h2, h3').filter({ hasText: articleTitle }))
  ).toBeVisible();

  
});
});


