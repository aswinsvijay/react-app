import { useState } from 'react';
import './App.css';

import Wordle from './Wordle/App';
import Blocks from './Blocks/App';

const appList = [
  { name: 'Wordle', Component: Wordle },
  { name: 'Blocks', Component: Blocks },
];

function App() {
  const [selected, setSelected] = useState('Wordle');

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {appList.map(({ name }) => {
          return (
            <button key={name} onClick={() => setSelected(name)}>
              {name}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }}>
        {appList.map(({ name, Component }) => {
          return selected === name && <Component key={name} />;
        })}
      </div>
    </div>
  );
}

export default App;
