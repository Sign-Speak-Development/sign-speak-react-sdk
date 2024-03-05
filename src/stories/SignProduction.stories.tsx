import type { Meta, StoryObj } from '@storybook/react';

import { SignProduction } from './SignProduction';

const meta = {
  title: 'Base/SignProduction',
  component: SignProduction,
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
  
} satisfies Meta<typeof SignProduction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: "test"
  },
};