import {
  insertTestTodos,
  makeTestTodoRepository,
} from '@/core/__tests__/utils/make-test-todo-repository';
import { test, expect, Page } from '@playwright/test';

const HOME_URL = '/';
const HEADING = 'Todo List';
const INPUT = 'Task';
const BUTTON = 'Create task';
const BUTTON_BUSY = 'Creating task...';
const NEW_TODO_TEXT = 'New Todo';

const getHeading = (p: Page) => p.getByRole('heading', { name: HEADING });
const getInput = (p: Page) => p.getByRole('textbox', { name: INPUT });
const getBtn = (p: Page) => p.getByRole('button', { name: BUTTON });
const getBtnBusy = (p: Page) => p.getByRole('button', { name: BUTTON_BUSY });

const getAll = (p: Page) => ({
  heading: getHeading(p),
  input: getInput(p),
  btn: getBtn(p),
  btnBusy: getBtnBusy(p),
});

test.beforeEach(async ({ page }) => {
  const { deleteTodoNoWhere } = await makeTestTodoRepository();
  await deleteTodoNoWhere();

  await page.goto(HOME_URL);
});

test.afterAll(async () => {
  const { deleteTodoNoWhere } = await makeTestTodoRepository();
  await deleteTodoNoWhere();
});

test.describe('<Home /> (E2E)', () => {
  test.describe('Rendering', () => {
    test('should have the correct html title', async ({ page }) => {
      await expect(page).toHaveTitle('Tests with Vitest and Playwright');
    });

    test('should render the heading, input and the button to create TODOs', async ({
      page,
    }) => {
      await expect(getHeading(page)).toBeVisible();
      await expect(getInput(page)).toBeVisible();
      await expect(getBtn(page)).toBeVisible();
    });
  });

  test.describe('Creation', () => {
    test('should allow creating a TODO', async ({ page }) => {
      const { btn, input } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });

      await expect(createdTodo).toBeVisible();
    });

    test('should trim the input description when creating the TODO', async ({
      page,
    }) => {
      const { btn, input } = getAll(page);

      const textToBeTrimmed = '   no spaces here   ';
      const textTrimmed = textToBeTrimmed.trim();

      await input.fill(textToBeTrimmed);
      await btn.click();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: textTrimmed });
      const createdTodoText = await createdTodo.textContent();

      // Removed await because TS complained
      // 'await' has no effect on the type of this expression. (ts 80007)
      expect(createdTodoText).toBe(textTrimmed);
    });

    test('should allow user to create more than one TODO', async ({ page }) => {
      const { btn, input } = getAll(page);

      const todo1 = 'Todo 1';
      const todo2 = 'Todo 2';

      await input.fill(todo1);
      await btn.click();

      const todo1Item = page.getByRole('listitem').filter({ hasText: todo1 });
      await expect(todo1Item).toBeVisible();

      await input.fill(todo2);
      await btn.click();

      const todo2Item = page.getByRole('listitem').filter({ hasText: todo2 });
      await expect(todo2Item).toBeVisible();
    });

    test('should disable the button while creating the TODO', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(getBtnBusy(page)).toBeVisible();
      await expect(getBtnBusy(page)).toBeDisabled();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();

      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    });

    test('should disable the input while creating the TODO', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(input).toBeDisabled();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });
      await expect(createdTodo).toBeVisible();

      await expect(input).toBeEnabled();
    });

    test('should clear the input after creating a todo', async ({ page }) => {
      const { btn, input } = getAll(page);
      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      await expect(input).toHaveValue('');
    });
  });

  test.describe('Delete', () => {
    test('should allow user to delete a todo', async ({ page }) => {
      const todos = await insertTestTodos();
      await page.reload(); // makes next.js revalidate cache

      const itemToDelete = page
        .getByRole('listitem')
        .filter({ hasText: todos[1].description });
      await expect(itemToDelete).toBeVisible();

      const deleteBtn = itemToDelete.getByRole('button');
      await deleteBtn.click();

      await itemToDelete.waitFor({ state: 'detached' });
      await expect(itemToDelete).not.toBeVisible();
    });

    test('should allow deleting all TODOs', async ({ page }) => {
      await insertTestTodos();
      await page.reload(); // makes next.js revalidate cache

      while (true) {
        const item = page.getByRole('listitem').first();
        const isVisible = await item.isVisible().catch(() => false);
        if (!isVisible) break;

        const text = await item.textContent();
        if (!text) {
          throw Error('Item text not found');
        }

        const deleteBtn = item.getByRole('button');
        await deleteBtn.click();

        const renewedItem = page
          .getByRole('listitem')
          .filter({ hasText: text });
        await renewedItem.waitFor({ state: 'detached' });
        await expect(renewedItem).not.toBeVisible();
      }
    });

    test('should disable list items while sending the action', async ({
      page,
    }) => {
      await insertTestTodos();
      await page.reload(); // makes next.js revalidate cache

      const itemToBeDeleted = page.getByRole('listitem').first();
      const itemToBeDeletedText = await itemToBeDeleted.textContent();

      if (!itemToBeDeletedText) {
        throw new Error('Item text is empty');
      }

      const deleteBtn = itemToBeDeleted.getByRole('button');
      await deleteBtn.click();

      const allDeleteButtons = await page
        .getByRole('button', { name: /^delete:/i })
        .all();

      for (const btn of allDeleteButtons) {
        await expect(btn).toBeDisabled();
      }

      const deleteItemNotVisible = page
        .getByRole('listitem')
        .filter({ hasText: itemToBeDeletedText });
      await deleteItemNotVisible.waitFor({ state: 'detached' });
      await expect(deleteItemNotVisible).not.toBeVisible();

      const renewedAllButtons = await page
        .getByRole('button', { name: /^delete:/i })
        .all();

      for (const btn of renewedAllButtons) {
        await expect(btn).toBeEnabled();
      }
    });
  });

  test.describe('Errors', () => {
    test('should display an error if description has 3 or fewer characters', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill('abc');
      await btn.click();

      const errorText = 'Description must have at least 3 characters';
      const error = page.getByText(errorText);

      await error.waitFor({ state: 'attached', timeout: 5000 });
      await expect(error).toBeVisible();
    });

    test('should display an error if a TODO already exists with the same description', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill('I exist');
      await btn.click();

      const errorText = 'A TODO with this ID or description already exists';
      const error = page.getByText(errorText);

      await error.waitFor({ state: 'attached', timeout: 5000 });
      await expect(error).toBeVisible();
    });

    test('should remove the error from the screen when the user fixes it', async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill('abc');
      await btn.click();

      const errorText = 'Description must have at least 3 characters';
      const error = page.getByText(errorText);

      await error.waitFor({ state: 'attached', timeout: 5000 });
      await expect(error).toBeVisible();

      await input.fill('This is a valid description');
      await btn.click();

      await error.waitFor({ state: 'detached', timeout: 5000 });
      await expect(error).not.toBeVisible();
    });
  });
});
