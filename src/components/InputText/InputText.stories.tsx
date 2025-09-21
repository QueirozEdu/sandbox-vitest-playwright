import { InputText } from '.';
import type { Meta, StoryObj } from '@storybook/nextjs';

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
    placeholder: 'Enter something...',
    required: true,
    disabled: false,
    readOnly: false,
    defaultValue: 'This is the default input value',
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'This is the error message',
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
