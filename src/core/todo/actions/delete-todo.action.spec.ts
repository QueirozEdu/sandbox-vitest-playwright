import { makeTestTodoMocks } from '@/core/__tests__/utils/make-test-todo-mocks';
import { deleteTodoAction } from './delete-todo.action';

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe('deleteTodoAction (unit)', () => {
  test('should call deleteTodoUseCase with the correct values', async () => {
    const { deleteTodoUseCaseSpy } = makeTestTodoMocks();
    const fakeId = 'any-id';
    await deleteTodoAction(fakeId);

    expect(deleteTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(fakeId);
  });

  test('should call revalidatePath if usecase returns success', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const fakeId = 'any-id';
    await deleteTodoAction(fakeId);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  test('should return the same value as usecase in case of success', async () => {
    const { successResult } = makeTestTodoMocks();
    const fakeId = 'any-id';
    const result = await deleteTodoAction(fakeId);

    expect(result).toStrictEqual(successResult);
  });

  test('should return the same value as usecase in case of error', async () => {
    const { deleteTodoUseCaseSpy, errorResult } = makeTestTodoMocks();
    const fakeId = 'any-id';

    deleteTodoUseCaseSpy.mockResolvedValue(errorResult);

    const result = await deleteTodoAction(fakeId);

    expect(result).toStrictEqual(errorResult);
  });
});
