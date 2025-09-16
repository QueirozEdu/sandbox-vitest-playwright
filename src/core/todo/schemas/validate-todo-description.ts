type ValidateTodoDescriptionType = {
  success: boolean;
  errors: string[];
};

export function validateTodoDescription(
  description: string
): ValidateTodoDescriptionType {
  const errors = [];

  if (description.length <= 3) {
    errors.push('Description should have more than 3 characters');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
