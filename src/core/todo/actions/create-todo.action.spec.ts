import * as createTodoUseCaseMod from '@/core/todo/usecases/create-todo.usecase';
import { revalidatePath } from 'next/cache';
import { createTodoAction } from './create-todo.action';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contracts';
import { makeTestTodoMocks } from '@/core/__tests__/utils/make-test-todo-mocks';

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe('createTodoAction (unit)', () => {
  test('should call createTodoUseCase with the correct values', async () => {
    const { createTodoUseCaseSpy } = makeTestTodoMocks();
    const expectedParamCall = 'Usecase should be called with this';
    await createTodoAction(expectedParamCall);

    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(
      expectedParamCall,
    );
  });

  test('should call revalidatePath if usecase returns success', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const description = 'Usecase should be called with this';
    await createTodoAction(description);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('should return the same value as the usecase in case of success', async () => {
    const { successResult } = makeTestTodoMocks();
    const description = 'Usecase should be called with this';
    const result = await createTodoAction(description);

    expect(result).toStrictEqual(successResult);
  });

  test('should return the same value as the usecase in case of error', async () => {
    const { createTodoUseCaseSpy, errorResult } = makeTestTodoMocks();
    const description = 'Usecase should be called with this';

    createTodoUseCaseSpy.mockResolvedValue(errorResult);

    const result = await createTodoAction(description);

    expect(result).toStrictEqual(errorResult);
  });
});
