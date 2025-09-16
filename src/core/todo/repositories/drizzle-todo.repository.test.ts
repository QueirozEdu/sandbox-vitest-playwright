import {
  insertTestTodos,
  makeTestTodoRepository,
} from '@/core/__tests__/utils/make-test-todo-repository';

describe('DrizzleTodoRepository (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  describe('findAll', () => {
    test('should return an empty array if table is clean', async () => {
      const { repository } = await makeTestTodoRepository();
      const result = await repository.findAll();
      expect(result).toStrictEqual([]);
      expect(result).toHaveLength(0);
    });

    test('should return all TODOs in desc order', async () => {
      const { repository } = await makeTestTodoRepository();
      await insertTestTodos();
      const result = await repository.findAll();
      expect(result[0].createdAt).toBe('date 4');
      expect(result[1].createdAt).toBe('date 3');
      expect(result[2].createdAt).toBe('date 2');
      expect(result[3].createdAt).toBe('date 1');
      expect(result[4].createdAt).toBe('date 0');
    });
  });

  describe('create', () => {
    test('creates a TODO if all data is valid', async () => {
      const { repository, todos } = await makeTestTodoRepository();
      const newTodo = await repository.create(todos[0]);
      expect(newTodo).toStrictEqual({
        success: true,
        todo: todos[0],
      });
    });

    test('fails if there is an identical description in the table', async () => {
      const { repository, todos } = await makeTestTodoRepository();

      // Creates a new todo
      await repository.create(todos[0]);

      // Tries to create another TODO with the same description
      const anotherTodo = {
        id: 'any id',
        description: todos[0].description,
        createdAt: 'any date',
      };
      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ['There is already a TODO with this ID or description'],
      });
    });

    test('Fails if there is an identical ID in the table', async () => {
      const { repository, todos } = await makeTestTodoRepository();

      // Creates a new TOOD
      await repository.create(todos[0]);

      // Tries to create another TODO with the same ID
      const anotherTodo = {
        id: todos[0].id,
        description: 'any description',
        createdAt: 'any date',
      };
      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ['There is already a TODO with this ID or description'],
      });
    });

    test('Fails if there is identical ID and description', async () => {
      const { repository, todos } = await makeTestTodoRepository();

      await repository.create(todos[0]);

      const anotherTodo = {
        id: todos[0].id,
        description: todos[0].description,
        createdAt: 'any date',
      };
      const result = await repository.create(anotherTodo);

      expect(result).toStrictEqual({
        success: false,
        errors: ['A TODO with this ID or description already exists'],
      });
    });
  });

  describe('remove', () => {
    test('Deletes a TODO if it exists', async () => {
      const { repository, todos } = await makeTestTodoRepository();
      await insertTestTodos();
      const result = await repository.remove(todos[0].id);

      expect(result).toStrictEqual({
        success: true,
        todo: todos[0],
      });
    });

    test('Fails when deleting a todo if it does not exist', async () => {
      const { repository } = await makeTestTodoRepository();
      const result = await repository.remove('any id');

      expect(result).toStrictEqual({
        success: false,
        errors: ['TODO does not exist'],
      });
    });
  });
});
