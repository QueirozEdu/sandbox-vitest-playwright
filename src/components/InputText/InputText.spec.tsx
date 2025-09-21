import { render, screen } from '@testing-library/react';
import { InputText, InputTextProps } from '.';
import userEvent from '@testing-library/user-event';

type Props = Partial<InputTextProps>;

const makeInput = (p: Props = {}) => {
  return (
    <InputText
      labelText='label'
      placeholder='placeholder'
      type='text'
      disabled={false}
      required={true}
      readOnly={false}
      {...p}
    />
  );
};

const renderInput = (p?: Props) => {
  const renderResult = render(makeInput(p));
  const input = screen.getByRole('textbox');
  return { input, renderResult };
};

const input = (p?: Props) => renderInput(p).input;

describe('<InputText />', () => {
  describe('default behavior', () => {
    test('renders with label', async () => {
      const el = input({ labelText: 'new label' });
      const label = screen.getByText('new label');
      expect(el).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });

    test('renders with placeholder', async () => {
      const el = input({ placeholder: 'new placeholder' });
      expect(el).toHaveAttribute('placeholder', 'new placeholder');
    });

    test('renders without placeholder', async () => {
      const el = input({ placeholder: undefined });
      expect(el).not.toHaveAttribute('placeholder');
    });

    test('renders wihtout label', async () => {
      input({ labelText: undefined });
      const label = screen.queryByRole('new label');
      expect(label).not.toBeInTheDocument();
    });

    test('uses labelText as aria-label when possible', async () => {
      expect(input()).toHaveAttribute('aria-label', 'label');
    });

    test('uses placeholder as aria-label fallback', async () => {
      expect(input({ labelText: undefined })).toHaveAttribute(
        'aria-label',
        'placeholder',
      );
    });

    test('displays the default value correctly', async () => {
      expect(input({ defaultValue: 'valor' })).toHaveValue('valor');
    });

    test('accepts other JSX props (name, maxLength)', async () => {
      const el = input({ name: 'name', maxLength: 10 });
      expect(el).toHaveAttribute('name', 'name');
      expect(el).toHaveAttribute('maxLength', '10');
    });
  });

  describe('accessibility', () => {
    test('does not displays the error message by default', async () => {
      const el = input();
      expect(el).toHaveAttribute('aria-invalid', 'false');
      expect(el).not.toHaveAttribute('aria-describedby');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('does not mark the input as invalid by default', async () => {
      const el = input();
      expect(el).toHaveAttribute('aria-invalid', 'false');
    });

    test('renders error message when `errorMessage` is passed', async () => {
      const el = input({ errorMessage: 'Error exists' });
      const error = screen.getByRole('alert');
      const errorId = error.getAttribute('id');

      expect(el).toHaveAttribute('aria-invalid', 'true');
      expect(el).toHaveAttribute('aria-describedby', errorId);
      expect(error).toBeInTheDocument();
    });
  });

  describe('interactive behavior', () => {
    test('updates the value as the user is typing', async () => {
      const user = userEvent.setup();
      const el = input();
      await user.type(el, 'texto');
      expect(el).toHaveValue('texto');
    });
  });

  describe('visual states', () => {
    test('applies visual classes when disabled', async () => {
      const el = input({ disabled: true });
      expect(el).toHaveClass('disabled:bg-slate-200 disabled:text-slate-400');
    });

    test('applies visual classes when readOnly', async () => {
      const el = input({ readOnly: true });
      expect(el).toHaveClass('read-only:bg-slate-100');
    });

    test('adds error classes (red ring) when invalid', async () => {
      const el = input({ errorMessage: 'Erro' });
      expect(el).toHaveClass('ring-red-500 focus:ring-red-700');
    });

    test('keeps the custom development classes', async () => {
      const el = input({ className: 'custom' });
      expect(el).toHaveClass('custom');
    });
  });
});
