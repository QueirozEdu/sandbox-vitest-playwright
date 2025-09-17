import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository';
import { deleteTodoUseCase } from './delete-todo.usecase';

describe('deleteTodoUseCase (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  test('should return an error if ID is invalid', async () => {
    const result = await deleteTodoUseCase('');

    expect(result).toStrictEqual({
      errors: ['Invalid ID'],
      success: false,
    });
  });

  test('should return success if TODO exists in the database', async () => {
    const { insertTodoDb, todos } = await makeTestTodoRepository();
    await insertTodoDb().values(todos);

    const result = await deleteTodoUseCase(todos[0].id);

    expect(result).toStrictEqual({
      success: true,
      todo: todos[0],
    });
  });

  test('should return an error if TODO does not exists in the database', async () => {
    const result = await deleteTodoUseCase('this-does-not-exist');

    expect(result).toStrictEqual({
      errors: ['TODO does not exist'],
      success: false,
    });
  });
});
