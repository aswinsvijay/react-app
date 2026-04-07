import type React from 'react';
import type { ClockComponentProps } from '../types';

export const BlockyClock: React.FC<ClockComponentProps> = ({ timeParts }) => {
  return <div className="blocky-clock-container">{timeParts}</div>;
};
