import { validateTodoDescription } from './validate-todo-description';

describe('validateTodoDescription (unit)', () => {
  test('should return errors when description is less than 4 characters', () => {
    const description = 'abc';
    const result = validateTodoDescription(description);

    expect(result.errors).toStrictEqual([
      'Description should have more than 3 characters',
    ]);
    expect(result.success).toBe(false);
  });
  test('should return success when description is more than 3 characters', () => {
    const description = 'abcd';
    const result = validateTodoDescription(description);

    expect(result.errors).toStrictEqual([]);
    expect(result.success).toBe(true);
  });
});
