import type { Meta, StoryObj } from '@storybook/react';

import { SpeechProduction } from './SpeechProduction';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Base/SpeechProduction',
  component: SpeechProduction,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    modelName: {control: 'text'},
    text: {control: 'text'},
    play: {control: 'bool'},
    onLoaded: { action: 'loaded' },
    onPlaying: { action: 'playing' },
    onStopped: { action: 'stopped' },
  },
  
} satisfies Meta<typeof SpeechProduction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: "test"
  },
};