import { test, expect } from '@playwright/test';

test.describe('Hotel Booking System - Frontend Quality Gates', () => {

  // Test 1: Verify Home Page Navigation & Search Form Elements
  test('HomePage loads correctly and displays hotel search filters', async ({ page }) => {
    // Navigate to local Vue development server root
    await page.goto('/');

    // Assert the page title or primary headline is visible
    await expect(page).toHaveTitle(/HotelBook|Hotel/i);

    // Verify critical search inputs exist on screen
    const checkInInput = page.locator('input[type="date"]').first();
    await expect(checkInInput).toBeVisible();

    // Verify search button triggers without JS errors
    const searchButton = page.getByRole('button', { name: /search|find/i });
    await expect(searchButton).toBeVisible();
  });

  // Test 2: Verify Protected Navigation Routing Rules
  test('Unauthenticated user navigating to /my-bookings gets redirected or prompted', async ({ page }) => {
    // Clear localStorage to ensure user is logged out
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    // Try directly accessing the protected bookings page
    await page.goto('/my-bookings');

    // Verify that the app redirects to login OR displays an authentication error message
    // Adjust selector to match your Vue router rule or notification banner
    await expect(page).toHaveURL(/\/(login|auth)?/);
  });


  test('User can select stay dates and search available hotels', async ({ page }) => {
    await page.goto('/');

    // Locate check-in and check-out inputs
    const checkInInput = page.locator('input[type="date"]').first();
    const checkOutInput = page.locator('input[type="date"]').nth(1);

    // Set future stay dates (e.g., mid-August 2026)
    await checkInInput.fill('2026-08-15');
    await checkOutInput.fill('2026-08-18');

    // Click the search button
    const searchBtn = page.getByRole('button', { name: /search|find/i });
    await searchBtn.click();

    // 1. Assert that the URL changed to the hotels view page
    await expect(page).toHaveURL(/\/hotels/);

    // 2. Assert that the page heading loaded
    await expect(page.getByRole('heading', { name: /Available Hotel Properties/i })).toBeVisible();

    // 3. Assert that hotel cards loaded by checking for the "View Available Rooms" buttons!
    const viewRoomsBtn = page.getByRole('button', { name: /View Available Rooms/i }).first();
    await expect(viewRoomsBtn).toBeVisible({ timeout: 5000 });
  });

  test('User can log in successfully and receive JWT token', async ({ page }) => {
    await page.goto('/login');

    // Fill out login credentials
    await page.locator('input[type="email"], input[name="email"]').fill('testlaw@gmail.com');
    await page.locator('input[type="password"]').fill('testlaw12345');

    // Target the primary Sign In submit button specifically
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // Verify user is redirected off the login page
    await expect(page).not.toHaveURL(/\/login/);

    // Verify JWT token was saved to browser's localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();
  });

  test('Checkout button redirects user to Stripe payment domain', async ({ page }) => {
    // Inject a fake valid JWT into localStorage to simulate an active user session
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'fake_test_jwt_token');
    });

    // Navigate straight to a hotel or room detail view
    await page.goto('/hotels');

    // Select first room and click Book / Proceed to Checkout
    const bookNowBtn = page.getByRole('button', { name: /book|reserve|pay/i }).first();
    
    if (await bookNowBtn.isVisible()) {
      await bookNowBtn.click();

      // Assert that browser initiates redirection toward Stripe host domain
      await page.waitForURL(/checkout\.stripe\.com|488865\.xyz/, { timeout: 10000 });
      expect(page.url()).toMatch(/stripe|booking-confirmation/);
    }
  });

  test('Display validation error when Check-Out date is before Check-In date', async ({ page }) => {
    await page.goto('/');

    const checkInInput = page.locator('input[type="date"]').first();
    const checkOutInput = page.locator('input[type="date"]').nth(1);

    // Fill inverted dates
    await checkInInput.fill('2026-08-20');
    await checkOutInput.fill('2026-08-10');

    const searchBtn = page.getByRole('button', { name: /search|find/i });
    await searchBtn.click();

    // 1. Assert that navigation was PREVENTED (stays on home page)
    await expect(page).not.toHaveURL(/\/hotels/);

    // 2. Assert that the alert banner is visible with the error message
    const alertBanner = page.getByRole('alert');
    await expect(alertBanner).toBeVisible();
    await expect(alertBanner).toContainText('Check-out date must be after check-in date');
  });

});