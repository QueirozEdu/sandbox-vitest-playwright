import * as createTodoUseCaseMod from '@/core/todo/usecases/create-todo.usecase';
import { revalidatePath } from 'next/cache';
import { createTodoAction } from './create-todo.action';
import { InvalidTodo, ValidTodo } from '../schemas/todo.contracts';

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe('createTodoAction (unit)', () => {
  test('should call createTodoUseCase with the correct values', async () => {
    const { createTodoUseCaseSpy } = makeMocks();
    const expectedParamCall = 'Usecase should be called with this';
    await createTodoAction(expectedParamCall);

    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(
      expectedParamCall
    );
  });

  test('should call revalidatePath if usecase returns success', async () => {
    const { revalidatePathMocked } = makeMocks();
    const description = 'Usecase should be called with this';
    await createTodoAction(description);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('should return the same value as the usecase in case of success', async () => {
    const { successResult } = makeMocks();
    const description = 'Usecase should be called with this';
    const result = await createTodoAction(description);

    expect(result).toStrictEqual(successResult);
  });

  test('should return the same value as the usecase in case of error', async () => {
    const { createTodoUseCaseSpy, errorResult } = makeMocks();
    const description = 'Usecase should be called with this';

    createTodoUseCaseSpy.mockResolvedValue(errorResult);

    const result = await createTodoAction(description);

    expect(result).toStrictEqual(errorResult);
  });
});

const makeMocks = () => {
  const successResult = {
    success: true,
    todo: {
      id: 'id',
      description: 'description',
      createdAt: 'createdAt',
    },
  } as ValidTodo;

  const errorResult = {
    success: false,
    errors: ['any', 'error'],
  } as InvalidTodo;

  const createTodoUseCaseSpy = vi
    .spyOn(createTodoUseCaseMod, 'createTodoUseCase')
    .mockResolvedValue(successResult);
  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    successResult,
    errorResult,
    createTodoUseCaseSpy,
    revalidatePathMocked,
  };
};
