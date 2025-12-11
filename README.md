# RealWorld UI Test Automation – Playwright Assessment

This project is my UI automation assessment built with Playwright.  
I covered the basic authentication flow (sign up and login) for the RealWorld demo application.  
The goal was to show how I set up a small automation framework, write clean tests, and use helpers to avoid repeated code.

---

## About the Project

I wrote tests that:

- Create a new user with a timestamp-based email and username
- Sign the user up
- Log the user in again
- Check that the username appears in the nav bar
- Reuse the same helper function for login and signup

Everything is kept simple and easy to follow so other testers can extend the project.

---
How to Run the Tests

Install dependencies:

```sh
npm install

Install Playwright browsers:
npx playwright install

Run all tests:
npx playwright test

GitHub Actions
The project includes a workflow file that runs Playwright tests on every push.
GitHub installs Node, installs Playwright, and then runs the test suite.

.github/workflows/playwright.yml

What I Learned
Before this project, my experience with Playwright was only from a demo application that I practiced on while learning the tool by myself. This assessment helped me apply that knowledge in a more practical and structured way.
During this work, I:
set up Playwright from scratch and made the whole framework run
wrote clear and simple UI tests
practiced writing tests in TypeScript inside a real workflow
used Playwright UI mode and trace viewer to debug issues
organized the project so it’s easy to understand and grow
Even though Playwright was new to me, this project gave me a very good hands-on experience and helped me feel more confident using it.







## Project Structure
tests/
  helpers/
    auth.ts                   # reusable signup/login helper

  auth.spec.ts                # sign up + login tests
  article.spec.ts             # create article tests
  article-edit-delete.spec.ts # edit and delete article tests
  favorite-toggle.spec.ts     # favorite / unfavorite article tests
  feed.spec.ts                # global feed and user feed tests

.github/
  workflows/
    playwright.yml            # GitHub Actions setup

playwright.config.ts
package.json

