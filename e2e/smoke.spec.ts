import { test, expect } from '@playwright/test';

test.describe('Frontend Smoke Tests', () => {
  test('Login and navigate to Dashboard', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Wait for the form to load
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });

    // Assuming there are input fields with type 'email' and 'password'
    await page.fill('input[type="email"], input[name="email"], #email', 'admin@edutracker.com');
    await page.fill('input[type="password"], input[name="password"], #password', '123456');

    // Click the submit button
    // It could be a button with text "Login", "Sign In", etc.
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitBtn.click();

    // Verify successful login by waiting for dashboard URL or specific element
    await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 15000 });
    
    // Check if the sidebar or a main header is visible, confirming the dashboard loaded
    await expect(page.locator('nav, aside, main, h1')).first().toBeVisible({ timeout: 10000 });
  });
});
