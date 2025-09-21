import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository';
import { test, expect, Page } from '@playwright/test';

const HOME_URL = '/';
const HEADING = 'Task list';
const INPUT = 'Task';
const BUTTON = 'Create Task';
const BUTTON_BUSY = 'Creating Task...';
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
    test('should have the correct html titlr', async ({ page }) => {
      await expect(page).toHaveTitle('Tests with Vitest and Playwright');
    });

    test('should render the header, input and button to create TODOs', async ({
      page,
    }) => {
      await expect(getHeading(page)).toBeVisible();
      await expect(getInput(page)).toBeVisible();
      await expect(getBtn(page)).toBeVisible();
    });
  });

  // Create
  test.describe('Create', () => {
    test('should allow user to create a todo', async ({ page }) => {
      const { btn, input } = getAll(page);

      await input.fill(NEW_TODO_TEXT);
      await btn.click();

      const createdTodo = page
        .getByRole('listitem')
        .filter({ hasText: NEW_TODO_TEXT });

      await expect(createdTodo).toBeVisible();
    });

    test('should trim the input description when creating a TODO', async ({
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

      await expect(createdTodoText).toBe(textTrimmed);
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
  });

  // Delete
  // Erros
});
