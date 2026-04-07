import type React from 'react';
import type { ClockComponentProps } from '../types';

const digitMap: Record<'_' | number, [number, number, number][]> = {
  _: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  0: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  1: [
    [2, 1, 0],
    [2, 1, 0],
    [2, 1, 0],
    [2, 1, 0],
    [2, 1, 0],
  ],
  2: [
    [0, 0, 0],
    [2, 1, 0],
    [0, 0, 0],
    [0, -1, -2],
    [0, 0, 0],
  ],
  3: [
    [0, 0, 0],
    [2, 1, 0],
    [0, 0, 0],
    [2, 1, 0],
    [0, 0, 0],
  ],
  4: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
    [2, 1, 0],
    [2, 1, 0],
  ],
  5: [
    [0, 0, 0],
    [0, -1, -2],
    [0, 0, 0],
    [2, 1, 0],
    [0, 0, 0],
  ],
  6: [
    [0, 0, 0],
    [0, -1, -2],
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  7: [
    [0, 0, 0],
    [2, 1, 0],
    [2, 1, 0],
    [2, 1, 0],
    [2, 1, 0],
  ],
  8: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  9: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
    [2, 1, 0],
    [0, 0, 0],
  ],
};

const BlockyDigit: React.FC<{ digit: number }> = ({ digit }) => {
  return (
    <div className="pixel-grid">
      {digitMap[digit].flat().map((value) => {
        return (
          <div
            className="pixel-wrapper"
            style={{
              transform: `translate(calc(${value} * 100%))`,
            }}
          >
            <div className="pixel square"></div>
          </div>
        );
      })}
    </div>
  );
};

export const BlockyClock: React.FC<ClockComponentProps> = ({ timeParts }) => {
  return (
    <div className="blocky-clock-container">
      {timeParts.map((digit) => (
        <BlockyDigit digit={digit} />
      ))}
    </div>
  );
};
