import type { Meta, StoryObj } from '@storybook/react';

import { SpeechRecognition } from './SpeechRecognition';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Base/SpeechRecognition',
  component: SpeechRecognition,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'This component is responsible for recognizing speech. The only model available is LATEST, but if you are on sole tenancy, there is the option of fine tuning via the API.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    buttonClassName: {control: 'text'},
    gotResult: { action: 'processed' },
    transcriptionClassName: {control: 'text'},
    modelName: {control: 'text'}
  },
  
} satisfies Meta<typeof SpeechRecognition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
export const OnlyButton: Story = {
  args: {
    transcriptionClassName: "hidden"
  },
};