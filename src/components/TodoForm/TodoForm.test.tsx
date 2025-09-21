import { render, screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { TodoForm } from '.';

const user = userEvent.setup();

describe('<TodoForm /> (integration)', () => {
  test('should render all form components', async () => {
    const { btn, input } = renderForm();
    expect(btn).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('should call the action with the correct values', async () => {
    const { btn, input, action } = renderForm();
    await user.type(input, 'task');
    await user.click(btn);
    expect(action).toHaveBeenCalledExactlyOnceWith('task');
  });

  test('should cut spaces from start to end in the description (trim)', async () => {
    const { btn, input, action } = renderForm();
    await user.type(input, '   task    ');
    await user.click(btn);
    expect(action).toHaveBeenCalledExactlyOnceWith('task');
  });

  test('should clean the input if the form returns success', async () => {
    const { btn, input } = renderForm();
    await user.type(input, '   task    ');
    await user.click(btn);
    expect(input).toHaveValue('');
  });

  test('should disable the botão while action is sent', async () => {
    const { btn, input } = renderForm({ delay: 5 });
    await user.type(input, 'task');
    await user.click(btn);

    await waitFor(() => expect(btn).toBeDisabled());
    await waitFor(() => expect(btn).toBeEnabled());
  });

  test('should disable the input while action is sent', async () => {
    const { btn, input } = renderForm({ delay: 5 });
    await user.type(input, 'task');
    await user.click(btn);

    await waitFor(() => expect(input).toBeDisabled());
    await waitFor(() => expect(input).toBeEnabled());
  });

  test('should change the button text while action is sent', async () => {
    const { btn, input } = renderForm({ delay: 5 });
    await user.type(input, 'task');
    await user.click(btn);

    await waitFor(() => expect(btn).toHaveAccessibleName('Creating task...'));
    await waitFor(() => expect(btn).toHaveAccessibleName('Create task'));
  });

  test('should display the error when action returns an error', async () => {
    const { btn, input } = renderForm({ success: false });
    await user.type(input, 'tasl');
    await user.click(btn);

    const error = await screen.findByRole('alert');

    expect(error).toHaveTextContent('error creating todo');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  test('should keep the text typed in the input if action returns an error', async () => {
    const { btn, input } = renderForm({ success: false });
    await user.type(input, 'task');
    await user.click(btn);

    expect(input).toHaveValue('task');
  });
});

type RenderForm = {
  delay?: number;
  success?: boolean;
};

function renderForm({ delay = 0, success = true }: RenderForm = {}) {
  const actionSuccessResult = {
    success: true,
    todo: { id: 'id', description: 'description', createdAt: 'createdAt' },
  };
  const actionErrorResult = {
    success: false,
    errors: ['error creating todo'],
  };
  const actionResult = success ? actionSuccessResult : actionErrorResult;

  const actionNoDelay = vi.fn().mockResolvedValue(actionResult);
  const actionDelayed = vi.fn().mockImplementation(async () => {
    await new Promise(r => setTimeout(r, delay));
    return actionResult;
  });
  const action = delay > 0 ? actionDelayed : actionNoDelay;

  render(<TodoForm action={action} />);

  const input = screen.getByLabelText('task');
  const btn = screen.getByRole('button');

  return { btn, input, action };
}
