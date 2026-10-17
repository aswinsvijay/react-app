import type React from 'react';
import type { ClockComponentProps } from '../types';
import { range } from 'es-toolkit';

const limits = [range(3), range(10), range(6), range(10), range(6), range(10)];

export const ScrollingClock: React.FC<ClockComponentProps> = ({ timeParts }) => {
  return (
    <div className="scrolling-clock-container">
      {limits.map((rng, i) => {
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
