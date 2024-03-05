import type { Meta, StoryObj } from '@storybook/react';

import { SignRecognition } from './SignRecognition';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Base/SignLanguageRecognition',
  component: SignRecognition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    buttonClassName: {control: 'text'},
    cameraClassName: {control: 'text'},
    gotResult: { action: 'processed' },
    interpretationClassName: {control: 'text'},
    modelName: {control: 'text'}
  },
  
} satisfies Meta<typeof SignRecognition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
export const OnlyButton: Story = {
  args: {
    cameraClassName: "hidden",
    interpretationClassName: "hidden"
  },
};