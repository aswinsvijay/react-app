import type React from 'react';
import type { ClockComponentProps } from '../types';
import { range } from '../utils';

const limits = [range(0, 2), range(0, 9), range(0, 5), range(0, 9), range(0, 5), range(0, 9)];

export const ScrollingClock: React.FC<ClockComponentProps> = ({ timeParts }) => {
  return (
    <div className="scrolling-clock-container">
      {([0, 1, 2, 3, 4, 5] as const).map((i) => {
        const rng = limits[i];
        const current = timeParts[i];

        return (
          <div
            className="rng-container"
            style={{
              marginTop: `calc(-1 * ${current} * var(--cell-size))`,
            }}
          >
            {rng.map((i) => {
              return (
                <div className={`number-container${i === current ? ' active' : ''}`}>
                  <div className={'inner'}>{i}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
