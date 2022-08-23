"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('homepage has Playwright in title and get started link linking to the intro page', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto('https://playwright.dev/');
    // Expect a title "to contain" a substring.
    yield (0, test_1.expect)(page).toHaveTitle(/Playwright/);
    // create a locator
    const getStarted = page.locator('text=Get Started');
    // Expect an attribute "to be strictly equal" to the value.
    yield (0, test_1.expect)(getStarted).toHaveAttribute('href', '/docs/intro');
    // Click the get started link.
    yield getStarted.click();
    // Expects the URL to contain intro.
    yield (0, test_1.expect)(page).toHaveURL(/.*intro/);
}));
