import * as sanitizeStrMod from '@/utils/sanitize-str';
import {
  InvalidTodo,
  makeValidatedTodo,
  ValidTodo,
} from './make-validated-todo';
import * as makeNewTodoMod from './make-new-todo';
import * as validateTodoDescriptionMod from '../schemas/validate-todo-description';

describe('makeValidatedTodo (unit)', () => {
  test('should call the function sanitizeStr with the correct value', () => {
    const { description, sanitizeStrSpy } = makeMocks();
    makeValidatedTodo(description);
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
  });

  test('should call validateTodoDescription with the return from sanitizeStr', () => {
    const { description, sanitizeStrSpy, validaTodoDescriptionSpy } =
      makeMocks();

    const sanitizeStrReturn = 'sanitizeStr return';
    sanitizeStrSpy.mockReturnValue(sanitizeStrReturn);

    makeValidatedTodo(description) as ValidTodo;

    expect(validaTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(
      sanitizeStrReturn
    );
  });

  test('should call makeNewTodo if validatedDescription returned success', () => {
    const { description } = makeMocks();
    const result = makeValidatedTodo(description) as ValidTodo;

    expect(result.success).toBe(true);

    expect(result.data.id).toBe('any-id');
    expect(result.data.description).toBe('abcd');
    expect(result.data.createdAt).toBe('any-date');
  });

  test('should call return validatedDescription.error if validation failed', () => {
    const { errors, description, validaTodoDescriptionSpy } = makeMocks();

    validaTodoDescriptionSpy.mockReturnValue({ errors, success: false });
    const result = makeValidatedTodo(description) as InvalidTodo;
    expect(result).toStrictEqual({ errors, success: false });
  });
});

const makeMocks = (description = 'abcd') => {
  const errors = ['any', 'error'];

  const todo = {
    id: 'any-id',
    description,
    createdAt: 'any-date',
  };

  const sanitizeStrSpy = vi
    .spyOn(sanitizeStrMod, 'sanitizeStr')
    .mockReturnValue(description);

  const validaTodoDescriptionSpy = vi
    .spyOn(validateTodoDescriptionMod, 'validateTodoDescription')
    .mockReturnValue({
      errors: [],
      success: true,
    });

  const makeNewTodoSpy = vi
    .spyOn(makeNewTodoMod, 'makeNewTodo')
    .mockReturnValue(todo);

  return {
    errors,
    todo,
    description,
    sanitizeStrSpy,
    validaTodoDescriptionSpy,
    makeNewTodoSpy,
  };
};
