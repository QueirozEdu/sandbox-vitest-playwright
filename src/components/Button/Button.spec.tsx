//This is a conscious implementation test
// We are testing if the button has the correct classes based on props
// The Testing Library recommends avoinding this kind of test

import { render, screen } from '@testing-library/react';
import { Button } from '.';
import { userEvent } from '@testing-library/user-event';

const VARIANT_DEFAULT_CLASSES = 'bg-blue-600 hover:bg-blue-700 text-blue-100';
const VARIANT_DANGER_CLASSES = 'bg-red-600 hover:bg-red-700 text-red-100';
const VARIANT_GHOST_CLASSES = 'bg-slate-300 hover:bg-slate-400 text-slate-950';

const SIZE_MD_CLASSES =
  'text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2';
const SIZE_SM_CLASSES =
  'text-xs/tight py-1 px-2 rounded-sm [&_svg]:w-3 [&_svg]:h-3 gap-1';
const SIZE_LG_CLASSES =
  'text-lg/tight py-4 px-6 rounded-lg [&_svg]:w-5 [&_svg]:h-5 gap-3';
const DISABLED_CLASSES =
  'disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed';

describe('<Button />', () => {
  describe('default JSX props', () => {
    test('should render the button with default props (only children)', async () => {
      render(<Button>Enviar formulário</Button>);

      const button = screen.getByRole('button', {
        name: /enviar formulário/i,
      });

      expect(button).toHaveClass(VARIANT_DEFAULT_CLASSES);
      expect(button).toHaveClass(SIZE_MD_CLASSES);
    });

    test('checks if the default JSX properties work correctly', async () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} type='submit' aria-hidden='false'>
          Send form
        </Button>,
      );

      const button = screen.getByText('Send form');

      await userEvent.click(button);
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(2);
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('variants (colors)', () => {
    test('checks if default applies the correct color', async () => {
      render(
        <Button variant='default' title='the button'>
          Send form
        </Button>,
      );

      const button = screen.getByTitle(/the button/i);
      expect(button).toHaveClass(VARIANT_DEFAULT_CLASSES);
    });

    test('checks if danger applies the correct color', async () => {
      render(
        <Button variant='danger' title='the button'>
          Enviar formulário
        </Button>,
      );

      const button = screen.getByTitle(/the button/i);
      expect(button).toHaveClass(VARIANT_DANGER_CLASSES);
    });

    test('checks if ghost applies the correct color', async () => {
      render(
        <Button variant='ghost' title='the button'>
          Enviar formulário
        </Button>,
      );

      const button = screen.getByTitle(/the button/i);
      expect(button).toHaveClass(VARIANT_GHOST_CLASSES);
    });
  });

  describe('size', () => {
    test('sm should be smallest', async () => {
      render(
        <Button size='sm' data-testid='anything'>
          Send form
        </Button>,
      );
      const button = screen.getByTestId(/anything/i);
      expect(button).toHaveClass(SIZE_SM_CLASSES);
    });

    test('md should be medium', async () => {
      render(
        <Button size='md' data-testid='anything'>
          Send form
        </Button>,
      );

      const button = screen.getByTestId(/anything/i);
      expect(button).toHaveClass(SIZE_MD_CLASSES);
    });

    test('lg should be big', async () => {
      const { container } = render(
        <Button size='lg' id='o-id'>
          Send form
        </Button>,
      );

      const button = container.querySelector('#o-id');

      expect(button).toHaveClass(SIZE_LG_CLASSES);
    });
  });

  describe('disabled', () => {
    test('classes for state disabled are correct', async () => {
      render(<Button disabled>Send form</Button>);

      const button = screen.getByRole('button', { name: /Send form/i });

      expect(button).toHaveClass(DISABLED_CLASSES);
      expect(button).toBeDisabled();
    });
  });
});
