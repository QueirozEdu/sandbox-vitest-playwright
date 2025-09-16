import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository';
import { createTodoUseCase } from './create-todo.usecase';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contracts';

describe('createTodoUseCase (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  test('should return an error if validation fails', async () => {
    const result = (await createTodoUseCase('')) as InvalidTodo;

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  test('should return a TODO if validation passes', async () => {
    const description = 'This test should work';
    const result = (await createTodoUseCase(description)) as ValidTodo;

    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual({
      createdAt: expect.any(String),
      description,
      id: expect.any(String),
    });
  });

  test('Should return an error if repository fails', async () => {
    // Creates a TODO once
    const description = 'This only works once';
    (await createTodoUseCase(description)) as ValidTodo;

    // Tries to recreate the same TODO and should return an error
    const result = (await createTodoUseCase(description)) as InvalidTodo;

    expect(result.success).toBe(false);
    expect(result.errors).toStrictEqual([
      'A TODO with this ID or description already exists',
    ]);
  });
});
