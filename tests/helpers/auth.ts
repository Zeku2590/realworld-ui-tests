// tests/helpers/auth.ts
import { expect, type Page } from '@playwright/test';

export async function signUpAndLogin(page: Page) {
  const timestamp = Date.now();
  const username = `user${timestamp}`;
  const email = `user${timestamp}@test.com`;
  const password = 'TestPassword123!';

  await page.goto('/#/register');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /sign up/i }).click();

  // 2) App redirects to login → perform explicit login
  await expect(page).toHaveURL(/#\/login/);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // 3) Now assert navbar shows the logged-in user
  const nav = page.locator('nav');
  await expect(nav.getByRole('link', { name: username })).toBeVisible();

  return { username, email, password };
}
