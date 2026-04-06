import './App.css';
import React, { useMemo, useState } from 'react';
import { variants } from './variants';
import { getTimeZoneOffsetString } from './utils';

type TimeZoneConfig = {
  label: string;
  timeZoneId: string;
};

const configs: TimeZoneConfig[] = [
  {
    timeZoneId: 'America/Chicago',
    label: 'Chicago',
  },
  {
    timeZoneId: 'Asia/Kolkata',
    label: 'India',
  },
  {
    timeZoneId: 'Europe/London',
    label: 'London',
  },
  {
    timeZoneId: 'Asia/Dubai',
    label: 'Dubai',
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
                  backgroundImage: `url(/clock/${config.timeZoneId.toLowerCase().replace('/', '-')}.jpg)`,
                }}
              ></div>
              <div className="clock-with-label">
                <div className="label">{config.label}</div>
                <div className="clock-wrapper">{config.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
