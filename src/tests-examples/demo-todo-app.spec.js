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
test_1.test.beforeEach(({ page }) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto('https://demo.playwright.dev/todomvc');
}));
const TODO_ITEMS = [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
];
test_1.test.describe('New Todo', () => {
    (0, test_1.test)('should allow me to add todo items', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Create 1st todo.
        yield page.locator('.new-todo').fill(TODO_ITEMS[0]);
        yield page.locator('.new-todo').press('Enter');
        // Make sure the list only has one todo item.
        yield (0, test_1.expect)(page.locator('.view label')).toHaveText([
            TODO_ITEMS[0]
        ]);
        // Create 2nd todo.
        yield page.locator('.new-todo').fill(TODO_ITEMS[1]);
        yield page.locator('.new-todo').press('Enter');
        // Make sure the list now has two todo items.
        yield (0, test_1.expect)(page.locator('.view label')).toHaveText([
            TODO_ITEMS[0],
            TODO_ITEMS[1]
        ]);
        yield checkNumberOfTodosInLocalStorage(page, 2);
    }));
    (0, test_1.test)('should clear text input field when an item is added', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Create one todo item.
        yield page.locator('.new-todo').fill(TODO_ITEMS[0]);
        yield page.locator('.new-todo').press('Enter');
        // Check that input is empty.
        yield (0, test_1.expect)(page.locator('.new-todo')).toBeEmpty();
        yield checkNumberOfTodosInLocalStorage(page, 1);
    }));
    (0, test_1.test)('should append new items to the bottom of the list', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Create 3 items.
        yield createDefaultTodos(page);
        // Check test using different methods.
        yield (0, test_1.expect)(page.locator('.todo-count')).toHaveText('3 items left');
        yield (0, test_1.expect)(page.locator('.todo-count')).toContainText('3');
        yield (0, test_1.expect)(page.locator('.todo-count')).toHaveText(/3/);
        // Check all items in one call.
        yield (0, test_1.expect)(page.locator('.view label')).toHaveText(TODO_ITEMS);
        yield checkNumberOfTodosInLocalStorage(page, 3);
    }));
    (0, test_1.test)('should show #main and #footer when items added', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.new-todo').fill(TODO_ITEMS[0]);
        yield page.locator('.new-todo').press('Enter');
        yield (0, test_1.expect)(page.locator('.main')).toBeVisible();
        yield (0, test_1.expect)(page.locator('.footer')).toBeVisible();
        yield checkNumberOfTodosInLocalStorage(page, 1);
    }));
});
test_1.test.describe('Mark all as completed', () => {
    test_1.test.beforeEach(({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createDefaultTodos(page);
        yield checkNumberOfTodosInLocalStorage(page, 3);
    }));
    test_1.test.afterEach(({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield checkNumberOfTodosInLocalStorage(page, 3);
    }));
    (0, test_1.test)('should allow me to mark all items as completed', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Complete all todos.
        yield page.locator('.toggle-all').check();
        // Ensure all todos have 'completed' class.
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveClass(['completed', 'completed', 'completed']);
        yield checkNumberOfCompletedTodosInLocalStorage(page, 3);
    }));
    (0, test_1.test)('should allow me to clear the complete state of all items', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Check and then immediately uncheck.
        yield page.locator('.toggle-all').check();
        yield page.locator('.toggle-all').uncheck();
        // Should be no completed classes.
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveClass(['', '', '']);
    }));
    (0, test_1.test)('complete all checkbox should update state when items are completed / cleared', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const toggleAll = page.locator('.toggle-all');
        yield toggleAll.check();
        yield (0, test_1.expect)(toggleAll).toBeChecked();
        yield checkNumberOfCompletedTodosInLocalStorage(page, 3);
        // Uncheck first todo.
        const firstTodo = page.locator('.todo-list li').nth(0);
        yield firstTodo.locator('.toggle').uncheck();
        // Reuse toggleAll locator and make sure its not checked.
        yield (0, test_1.expect)(toggleAll).not.toBeChecked();
        yield firstTodo.locator('.toggle').check();
        yield checkNumberOfCompletedTodosInLocalStorage(page, 3);
        // Assert the toggle all is checked again.
        yield (0, test_1.expect)(toggleAll).toBeChecked();
    }));
});
test_1.test.describe('Item', () => {
    (0, test_1.test)('should allow me to mark items as complete', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Create two items.
        for (const item of TODO_ITEMS.slice(0, 2)) {
            yield page.locator('.new-todo').fill(item);
            yield page.locator('.new-todo').press('Enter');
        }
        // Check first item.
        const firstTodo = page.locator('.todo-list li').nth(0);
        yield firstTodo.locator('.toggle').check();
        yield (0, test_1.expect)(firstTodo).toHaveClass('completed');
        // Check second item.
        const secondTodo = page.locator('.todo-list li').nth(1);
        yield (0, test_1.expect)(secondTodo).not.toHaveClass('completed');
        yield secondTodo.locator('.toggle').check();
        // Assert completed class.
        yield (0, test_1.expect)(firstTodo).toHaveClass('completed');
        yield (0, test_1.expect)(secondTodo).toHaveClass('completed');
    }));
    (0, test_1.test)('should allow me to un-mark items as complete', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        // Create two items.
        for (const item of TODO_ITEMS.slice(0, 2)) {
            yield page.locator('.new-todo').fill(item);
            yield page.locator('.new-todo').press('Enter');
        }
        const firstTodo = page.locator('.todo-list li').nth(0);
        const secondTodo = page.locator('.todo-list li').nth(1);
        yield firstTodo.locator('.toggle').check();
        yield (0, test_1.expect)(firstTodo).toHaveClass('completed');
        yield (0, test_1.expect)(secondTodo).not.toHaveClass('completed');
        yield checkNumberOfCompletedTodosInLocalStorage(page, 1);
        yield firstTodo.locator('.toggle').uncheck();
        yield (0, test_1.expect)(firstTodo).not.toHaveClass('completed');
        yield (0, test_1.expect)(secondTodo).not.toHaveClass('completed');
        yield checkNumberOfCompletedTodosInLocalStorage(page, 0);
    }));
    (0, test_1.test)('should allow me to edit an item', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createDefaultTodos(page);
        const todoItems = page.locator('.todo-list li');
        const secondTodo = todoItems.nth(1);
        yield secondTodo.dblclick();
        yield (0, test_1.expect)(secondTodo.locator('.edit')).toHaveValue(TODO_ITEMS[1]);
        yield secondTodo.locator('.edit').fill('buy some sausages');
        yield secondTodo.locator('.edit').press('Enter');
        // Explicitly assert the new text value.
        yield (0, test_1.expect)(todoItems).toHaveText([
            TODO_ITEMS[0],
            'buy some sausages',
            TODO_ITEMS[2]
        ]);
        yield checkTodosInLocalStorage(page, 'buy some sausages');
    }));
});
test_1.test.describe('Editing', () => {
    test_1.test.beforeEach(({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createDefaultTodos(page);
        yield checkNumberOfTodosInLocalStorage(page, 3);
    }));
    (0, test_1.test)('should hide other controls when editing', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const todoItem = page.locator('.todo-list li').nth(1);
        yield todoItem.dblclick();
        yield (0, test_1.expect)(todoItem.locator('.toggle')).not.toBeVisible();
        yield (0, test_1.expect)(todoItem.locator('label')).not.toBeVisible();
        yield checkNumberOfTodosInLocalStorage(page, 3);
    }));
    (0, test_1.test)('should save edits on blur', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const todoItems = page.locator('.todo-list li');
        yield todoItems.nth(1).dblclick();
        yield todoItems.nth(1).locator('.edit').fill('buy some sausages');
        yield todoItems.nth(1).locator('.edit').dispatchEvent('blur');
        yield (0, test_1.expect)(todoItems).toHaveText([
            TODO_ITEMS[0],
            'buy some sausages',
            TODO_ITEMS[2],
        ]);
        yield checkTodosInLocalStorage(page, 'buy some sausages');
    }));
    (0, test_1.test)('should trim entered text', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const todoItems = page.locator('.todo-list li');
        yield todoItems.nth(1).dblclick();
        yield todoItems.nth(1).locator('.edit').fill('    buy some sausages    ');
        yield todoItems.nth(1).locator('.edit').press('Enter');
        yield (0, test_1.expect)(todoItems).toHaveText([
            TODO_ITEMS[0],
            'buy some sausages',
            TODO_ITEMS[2],
        ]);
        yield checkTodosInLocalStorage(page, 'buy some sausages');
    }));
    (0, test_1.test)('should remove the item if an empty text string was entered', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const todoItems = page.locator('.todo-list li');
        yield todoItems.nth(1).dblclick();
        yield todoItems.nth(1).locator('.edit').fill('');
        yield todoItems.nth(1).locator('.edit').press('Enter');
        yield (0, test_1.expect)(todoItems).toHaveText([
            TODO_ITEMS[0],
            TODO_ITEMS[2],
        ]);
    }));
    (0, test_1.test)('should cancel edits on escape', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const todoItems = page.locator('.todo-list li');
        yield todoItems.nth(1).dblclick();
        yield todoItems.nth(1).locator('.edit').press('Escape');
        yield (0, test_1.expect)(todoItems).toHaveText(TODO_ITEMS);
    }));
});
test_1.test.describe('Counter', () => {
    (0, test_1.test)('should display the current number of todo items', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.new-todo').fill(TODO_ITEMS[0]);
        yield page.locator('.new-todo').press('Enter');
        yield (0, test_1.expect)(page.locator('.todo-count')).toContainText('1');
        yield page.locator('.new-todo').fill(TODO_ITEMS[1]);
        yield page.locator('.new-todo').press('Enter');
        yield (0, test_1.expect)(page.locator('.todo-count')).toContainText('2');
        yield checkNumberOfTodosInLocalStorage(page, 2);
    }));
});
test_1.test.describe('Clear completed button', () => {
    test_1.test.beforeEach(({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createDefaultTodos(page);
    }));
    (0, test_1.test)('should display the correct text', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.todo-list li .toggle').first().check();
        yield (0, test_1.expect)(page.locator('.clear-completed')).toHaveText('Clear completed');
    }));
    (0, test_1.test)('should remove completed items when clicked', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        const todoItems = page.locator('.todo-list li');
        yield todoItems.nth(1).locator('.toggle').check();
        yield page.locator('.clear-completed').click();
        yield (0, test_1.expect)(todoItems).toHaveCount(2);
        yield (0, test_1.expect)(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    }));
    (0, test_1.test)('should be hidden when there are no items that are completed', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.todo-list li .toggle').first().check();
        yield page.locator('.clear-completed').click();
        yield (0, test_1.expect)(page.locator('.clear-completed')).toBeHidden();
    }));
});
test_1.test.describe('Persistence', () => {
    (0, test_1.test)('should persist its data', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        for (const item of TODO_ITEMS.slice(0, 2)) {
            yield page.locator('.new-todo').fill(item);
            yield page.locator('.new-todo').press('Enter');
        }
        const todoItems = page.locator('.todo-list li');
        yield todoItems.nth(0).locator('.toggle').check();
        yield (0, test_1.expect)(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
        yield (0, test_1.expect)(todoItems).toHaveClass(['completed', '']);
        // Ensure there is 1 completed item.
        checkNumberOfCompletedTodosInLocalStorage(page, 1);
        // Now reload.
        yield page.reload();
        yield (0, test_1.expect)(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
        yield (0, test_1.expect)(todoItems).toHaveClass(['completed', '']);
    }));
});
test_1.test.describe('Routing', () => {
    test_1.test.beforeEach(({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield createDefaultTodos(page);
        // make sure the app had a chance to save updated todos in storage
        // before navigating to a new view, otherwise the items can get lost :(
        // in some frameworks like Durandal
        yield checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    }));
    (0, test_1.test)('should allow me to display active items', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.todo-list li .toggle').nth(1).check();
        yield checkNumberOfCompletedTodosInLocalStorage(page, 1);
        yield page.locator('.filters >> text=Active').click();
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(2);
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    }));
    (0, test_1.test)('should respect the back button', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.todo-list li .toggle').nth(1).check();
        yield checkNumberOfCompletedTodosInLocalStorage(page, 1);
        yield test_1.test.step('Showing all items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.locator('.filters >> text=All').click();
            yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(3);
        }));
        yield test_1.test.step('Showing active items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.locator('.filters >> text=Active').click();
        }));
        yield test_1.test.step('Showing completed items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.locator('.filters >> text=Completed').click();
        }));
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(1);
        yield page.goBack();
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(2);
        yield page.goBack();
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(3);
    }));
    (0, test_1.test)('should allow me to display completed items', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.todo-list li .toggle').nth(1).check();
        yield checkNumberOfCompletedTodosInLocalStorage(page, 1);
        yield page.locator('.filters >> text=Completed').click();
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(1);
    }));
    (0, test_1.test)('should allow me to display all items', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.locator('.todo-list li .toggle').nth(1).check();
        yield checkNumberOfCompletedTodosInLocalStorage(page, 1);
        yield page.locator('.filters >> text=Active').click();
        yield page.locator('.filters >> text=Completed').click();
        yield page.locator('.filters >> text=All').click();
        yield (0, test_1.expect)(page.locator('.todo-list li')).toHaveCount(3);
    }));
    (0, test_1.test)('should highlight the currently applied filter', ({ page }) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, test_1.expect)(page.locator('.filters >> text=All')).toHaveClass('selected');
        yield page.locator('.filters >> text=Active').click();
        // Page change - active items.
        yield (0, test_1.expect)(page.locator('.filters >> text=Active')).toHaveClass('selected');
        yield page.locator('.filters >> text=Completed').click();
        // Page change - completed items.
        yield (0, test_1.expect)(page.locator('.filters >> text=Completed')).toHaveClass('selected');
    }));
});
function createDefaultTodos(page) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of TODO_ITEMS) {
            yield page.locator('.new-todo').fill(item);
            yield page.locator('.new-todo').press('Enter');
        }
    });
}
function checkNumberOfTodosInLocalStorage(page, expected) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.waitForFunction(e => {
            return JSON.parse(localStorage['react-todos']).length === e;
        }, expected);
    });
}
function checkNumberOfCompletedTodosInLocalStorage(page, expected) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.waitForFunction(e => {
            return JSON.parse(localStorage['react-todos']).filter((todo) => todo.completed).length === e;
        }, expected);
    });
}
function checkTodosInLocalStorage(page, title) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.waitForFunction(t => {
            return JSON.parse(localStorage['react-todos']).map((todo) => todo.title).includes(t);
        }, title);
    });
}
