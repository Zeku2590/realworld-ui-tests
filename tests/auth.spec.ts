import { test, expect } from '@playwright/test';
import { loadConfig } from '../utils/configLoader';


const cfg = loadConfig();

test.describe('Auth flow', () => {
  test.only('User can sign up and log in', async ({ page }) => {
  const timestamp = Date.now();
  const username = `user${timestamp}`;
  const email = `user${timestamp}@test.com`;
  const password = 'TestPassword123!';

    // ✅ Sign up 
    await page.goto('/');
    await page.click('text=Sign up');
    await page.fill('input[formcontrolname="username"]', username);
    await page.fill('input[formcontrolname="email"]', email);
    await page.fill('input[formcontrolname="password"]', password);
    await page.locator('button:has-text("Sign up")').click();

    // ✅ Check login success
    await page.goto('/#/login');
    await expect(
    page.getByRole('button', { name: /sign in/i })
    ).toBeVisible();

  //✅ Login again
    await page.goto('/#/login');
    await page.fill('input[formcontrolname="email"]', email);
    await page.fill('input[formcontrolname="password"]', password);
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeEnabled({ timeout: 5000 });
    await signInButton.click();
  
   
     //✅ Logout
    const nav =page.locator('nav');
    await expect(nav.getByRole('link', { name: username })).toBeVisible();
    await expect(nav.getByRole('link', { name: /settings/i })).toBeVisible();
    await nav.getByRole('link', { name: /settings/i }).click();


     const settingsLink = page.getByRole('link', { name: /settings/i });
     await settingsLink.waitFor({ state: 'visible', timeout: 10000 });
     await settingsLink.click();
     await expect(page).toHaveURL(/.*settings/); 
     await page.click('text=Or click here to logout.');

    //✅ Login with wrong password
    await page.goto('/');

    await page.click('text=Sign in');
    await page.fill('input[formcontrolname="email"]', email);
    await page.fill('input[formcontrolname="password"]', 'WrongPassword!');
    await page.locator('button:has-text("Sign in")').click();

    await expect(page.locator('.error-messages').first()).toContainText('email');


  });
});

