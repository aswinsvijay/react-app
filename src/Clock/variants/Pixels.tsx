import type React from 'react';
import type { ClockComponentProps } from '../types';

export const Pixels: React.FC<ClockComponentProps> = ({ timeParts }) => {
  return <div className="analog-pixels-clock-container">{timeParts}</div>;
};
