//This is a conscious implementation test
// We are testing if the button has the correct classes based on props
// The Testing Library recommends avoinding this kind of test

import { render, screen } from '@testing-library/react';
import { Button } from '.';

describe('<Button />', () => {
  describe('props padrão e JSX', () => {
    test('should render the button with default props (only children)', async () => {
      render(<Button>Enviar formulário</Button>);

      const button = screen.getByRole('button', {
        name: /enviar formulário/i,
      });

      expect(button).toHaveClass('bg-blue-600 hover:bg-blue-700 text-blue-100');
      expect(button).toHaveClass(
        'text-base/tight py-2 px-4 rounded-md [&_svg]:w-4 [&_svg]:h-4 gap-2',
      );

      // expect(button).toMatchSnapshot();
    });

    // test('checks if the default JSX properties work correctly', async () => {});
  });

  // describe('variants (cores)', () => {
  //   test('checks if default applies the correct color', async () => {});

  //   test('checks if danger applies the correct color', async () => {});

  //   test('checks if ghost applies the correct color', async () => {});
  // });

  // describe('size (tamanhos)', () => {
  //   test('size sm should be smaller', async () => {});

  //   test('size md should be medium', async () => {});

  //   test('size lg should be big', async () => {});
  // });

  // describe('disabled', () => {
  //   test('classes for disabled states are correct', async () => {});
  // });
});
