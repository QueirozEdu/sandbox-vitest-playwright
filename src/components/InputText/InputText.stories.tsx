import { InputText } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InputText> = {
  title: 'Components/Forms/InputText',
  component: InputText,
  decorators: [
    Story => (
      <div className='max-w-screen-lg mx-auto p-12'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'tel', 'url', 'search'],
      description: 'This is the input type',
    },
    labelText: {
      control: 'text',
      description: 'Input label',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to the user',
    },
    placeholder: {
      control: 'text',
      description: 'An example of use',
    },
    required: {
      control: 'boolean',
      description: 'Field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Field is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read only',
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputText>;

export const Default: Story = {
  args: {
    type: 'text',
    labelText: 'Input Label',
    errorMessage: '',
    placeholder: 'Digite algo...',
    required: true,
    disabled: false,
    readOnly: false,
    defaultValue: 'Este é o valor padrão do input',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'Essa é a mensagem de erro',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    readOnly: true,
  },
};
