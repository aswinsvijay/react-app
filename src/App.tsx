import { useState } from 'react';
import './App.css';

import Wordle from './Wordle/App';
import Blocks from './Blocks/App';
import Clock from './Clock/App';
import NoThanks from './NoThanks/App';

const clientOnlyApps = [
  { name: 'Wordle', Component: Wordle },
  { name: 'Blocks', Component: Blocks },
  { name: 'Clock', Component: Clock },
] as const;

const serverRequiredApps = [{ name: 'NoThanks', Component: NoThanks }] as const;

type AppName = (typeof clientOnlyApps | typeof serverRequiredApps)[number]['name'];

const hamburgerStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  padding: 4,
  position: 'absolute',
  top: 12,
  left: 12,
  zIndex: 1001,
  background: 'rgba(255,255,255,0.9)',
  borderRadius: 6,
  border: '1px solid #eee',
};

const barStyle: React.CSSProperties = {
  width: 22,
  height: 3,
  background: '#333',
  borderRadius: 2,
};

const sidebarWidth = 160;

function Sidebar({
  open,
  onAppSelect,
  selected,
}: {
  open: boolean;
  onAppSelect: (name: AppName) => void;
  selected: AppName;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: sidebarWidth,
        background: '#fafbfc',
        borderRight: '1px solid #d6dbe0',
        boxShadow: '2px 0 8px 0 rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        transform: open ? 'translateX(0)' : `translateX(-${sidebarWidth}px)`,
        transition: 'transform 0.3s cubic-bezier(.42,0,.28,1.31)',
        zIndex: 1002,
        gap: 2,
      }}
    >
      {[...clientOnlyApps, ...serverRequiredApps].map(({ name }) => (
        <button
          key={name}
          style={{
            background: selected === name ? '#e8eaf0' : 'transparent',
            border: 'none',
            padding: '12px 18px',
            textAlign: 'left',
            fontSize: 16,
            cursor: 'pointer',
            width: '100%',
            color: '#223',
            outline: 'none',
            fontWeight: selected === name ? 'bold' : undefined,
            borderLeft: selected === name ? '3px solid #1976d2' : '3px solid transparent',
            transition: 'background 0.2s, border 0.3s',
          }}
          onClick={() => onAppSelect(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function Hamburger({ onClick }: { onClick: () => void }) {
  return (
    <div style={hamburgerStyle} onClick={onClick} aria-label="Toggle sidebar">
      <div style={barStyle} />
      <div style={barStyle} />
      <div style={barStyle} />
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState<AppName>('Clock');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', position: 'relative' }}>
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1001,
            background: 'rgba(0,0,0,0)', // transparent but blocks mouse events
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        open={sidebarOpen}
        onAppSelect={(name) => {
          setSelected(name);
          setSidebarOpen(false);
        }}
        selected={selected}
      />
      <Hamburger onClick={() => setSidebarOpen(true)} />
      <div
        style={{
          flex: 1,
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          transition: 'filter 0.3s',
          filter: sidebarOpen ? 'blur(1px) grayscale(0.08)' : 'none',
        }}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          style={{
            minHeight: '100vh',
          }}
        >
          {[...clientOnlyApps, ...serverRequiredApps].map(({ name, Component }) => {
            return selected === name && <Component key={name} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
