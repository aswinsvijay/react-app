import { useP2PClient, useP2PServer } from '../hooks';
import './App.css';
import React, { useEffect, useMemo, useState } from 'react';

type Events = {
  identity: {
    name: string;
  };
};

type Message = {
  [K in keyof Events]: {
    type: K;
    data: Events[K];
  };
};

type GameState = {
  players: Record<
    string,
    {
      connection: string;
    }
  >;
  currentPlayer: string;
  deck: number[];
};

const Host: React.FC = () => {
  const { hostId, connections } = useP2PServer();
  const connectionsCount = useMemo(() => connections.size, [connections]);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!hostId) return;
    try {
      await navigator.clipboard.writeText(hostId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {
      // fallback for environments without clipboard API
      setCopied(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <strong>Game ID: {hostId ?? '…'}</strong>
      </div>
      <button onClick={handleCopy} disabled={!hostId}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {connectionsCount} connections
    </div>
  );
};

const Join: React.FC = () => {
  const [hostId, setHostId] = useState('');
  const [name, setName] = useState('');
  const { join, lastError, status } = useP2PClient();

  useEffect(() => {
    if (status !== 'connected') {
      return;
    }
  }, [status]);

  return (
    <div className="join-container">
      <h2>Join a Host</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={hostId}
          onChange={(e) => setHostId(e.target.value)}
          placeholder="Enter game ID"
          style={{ padding: 8, width: 240 }}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          style={{ padding: 8, width: 240 }}
        />
        <button onClick={() => join(hostId.trim())} disabled={!hostId.trim() || status === 'connecting'}>
          {status === 'connecting' ? 'Joining…' : 'Join'}
        </button>
      </div>

      <div style={{}}>
        <strong>Status:</strong> <span>{status}</span>
        {lastError ? (
          <div style={{ color: 'crimson' }}>
            <strong>Error:</strong> {lastError}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const App: React.FC<NonNullable<unknown>> = () => {
  const modes = ['Host', 'Join'] as const;

  const [mode, setMode] = useState<(typeof modes)[number]>('Join');

  return (
    <div className="App" tabIndex={0}>
      <header className="App-header" style={{ justifyContent: 'unset', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          {modes.map((mode) => (
            <button key={mode} style={{}} onClick={() => setMode(mode)}>
              {mode}
            </button>
          ))}
        </div>
        <div>{mode === 'Host' ? <Host /> : <Join />}</div>
      </header>
    </div>
  );
};

export default App;
