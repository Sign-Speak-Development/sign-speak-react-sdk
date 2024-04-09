import type { Meta, StoryObj } from '@storybook/react';

import { SignRecognition } from './SignRecognition';

const meta = {
  title: 'Base/SignLanguageRecognition',
  component: SignRecognition,
  parameters: {
    layout: 'centered',
    description: {
      component: 'This component is responsible for recognizing sign language and outputting english. If you\'ve not been instructed otherwise, the only model available to you is LATEST'
    },
  },
  tags: ['autodocs'],
  argTypes: {
    buttonClassName: {control: 'text'},
    cameraClassName: {control: 'text'},
    gotResult: { action: 'processed' },
    interpretationClassName: {control: 'text'},
    modelName: {control: 'text'},
    includeFeedback: {control: 'boolean'}
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