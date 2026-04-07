import type React from 'react';
import type { ClockComponentProps } from '../types';

export const Slider: React.FC<ClockComponentProps> = ({ timeParts }) => {
  return <div className="scrolling-clock-container">{timeParts}</div>;
};
