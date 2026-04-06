import './App.css';
import React, { useMemo, useState } from 'react';
import { variants } from './variants';

type TimeZoneConfig = {
  label: string;
  timeZoneId: string;
  size: `${number}px`;
};

function divMod(value: number, divisor: number) {
  return [Math.floor(value / divisor), Math.floor(value % divisor)] as const;
}

function range(start: number, stop: number) {
  const res = [];

  for (let i = start; i <= stop; ++i) {
    res.push(i);
  }

  return res;
}

function splitTensAndOnes(value: number) {
  return divMod(value, 10);
}

function getTimeZoneOffset(timeZoneId: string) {
  const date = new Date();

  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZoneId }));

  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
}

function getTimeZoneOffsetString(timeZoneId: string) {
  const timeZoneOffsetMinutes = getTimeZoneOffset(timeZoneId);

  const sign = timeZoneOffsetMinutes < 0 ? '-' : '+';
  const absoluteOffset = Math.abs(timeZoneOffsetMinutes);

  const [hours, minutes] = divMod(absoluteOffset, 60);
  const [hoursString, minutesString] = [`${hours}`, `${minutes}`];

  return `UTC${sign}${hoursString.padStart(2, '0')}:${minutesString.padStart(2, '0')}`;
}

const configs: TimeZoneConfig[] = [
  {
    timeZoneId: 'America/Chicago',
    label: 'Chicago',
    size: '40px',
  },
  {
    timeZoneId: 'Asia/Kolkata',
    label: 'India',
    size: '40px',
  },
  {
    timeZoneId: 'Europe/London',
    label: 'London',
    size: '40px',
  },
  {
    timeZoneId: 'Asia/Dubai',
    label: 'Dubai',
    size: '40px',
  },
];

configs.forEach((config) => {
  config.label = `${config.label} (${getTimeZoneOffsetString(config.timeZoneId)})`;
});

const App: React.FC<NonNullable<unknown>> = () => {
  const [variantIndex, setVariantIndex] = useState(0);

  const Component = useMemo(() => variants[variantIndex], [variantIndex]);

  const setNextVariantIndex = () => {
    setVariantIndex((cur) => (cur + 1) % variants.length);
  };

  return (
    <div className="App" onClick={setNextVariantIndex}>
      <div id="clock-grid">
        {configs.map((config) => {
          return (
            <div className="background-container">
              <div
                className="background"
                style={{
                  backgroundImage: `url(public/clock/${config.timeZoneId.toLowerCase().replace('/', '-')}.jpg)`,
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
