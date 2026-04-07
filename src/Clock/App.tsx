import './App.css';
import React, { useMemo, useState } from 'react';
import { variants } from './variants';
import { getTimeZoneOffsetMins, getTimeZoneOffsetString, splitTensAndOnes } from './utils';

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
  // A state to force update the component every second
  const [now, setNow] = useState<number>();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  const [variantIndex, setVariantIndex] = useState(0);

  const Component = useMemo(() => variants[variantIndex], [variantIndex]);

  const setNextVariantIndex = () => {
    setVariantIndex((cur) => (cur + 1) % variants.length);
  };

  if (!now) {
    return null;
  }

  return (
    <div className="App" onClick={setNextVariantIndex}>
      <div id="clock-grid">
        {configs.map((config) => {
          const currentTime = new Date(now);

          currentTime.setMinutes(currentTime.getMinutes() + getTimeZoneOffsetMins(config.timeZoneId));

          const [[h_t, h_o], [m_t, m_o], [s_t, s_o]] = [
            splitTensAndOnes(currentTime.getUTCHours()),
            splitTensAndOnes(currentTime.getUTCMinutes()),
            splitTensAndOnes(currentTime.getUTCSeconds()),
          ];

          const timeParts = [h_t, h_o, m_t, m_o, s_t, s_o] as const;

          return (
            <div className="background-container">
              <div
                className="background"
                style={{
                  backgroundImage: `url(./clock/${config.timeZoneId.toLowerCase().replace('/', '-')}.jpg)`,
                }}
              ></div>
              <div className="clock-with-label">
                <div className="label">{config.label}</div>
                <div className="clock-wrapper">
                  <Component timeParts={timeParts} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
