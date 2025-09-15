import { makeNewTodo } from './make-new-todo';

describe('make new todo (unit)', () => {
  describe('create', () => {
    test('should return a new valid TODO', () => {
      //AAA -> Arrange, Act, Assert

      //Arrange
      const expectedTodo = {
        id: expect.any(String),
        description: 'my new todo',
        createdAt: expect.any(String),
      };

      //Act
      const newTodo = makeNewTodo('my new todo');

      //Assert
      expect(newTodo.description).toBe(expectedTodo.description);
      expect(newTodo).toStrictEqual(expectedTodo);
    });
  });
});
