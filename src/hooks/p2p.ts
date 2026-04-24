import { useCallback, useEffect, useRef, useState } from 'react';
import Peer, { type DataConnection } from 'peerjs';

export const useP2PServer = <TData>() => {
  const [hostId, setHostId] = useState<string | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [connections, setConnections] = useState(new Map<string, DataConnection>());
  const [message, setMessage] = useState<{
    from: string;
    data: TData;
  } | null>(null);

  const updateConnection = useCallback((id: string, connection: DataConnection | null) => {
    setConnections((connections) => {
      const newMap = new Map(connections);

      if (connection) {
        newMap.set(id, connection);
      } else {
        newMap.delete(id);
      }

      return newMap;
    });
  }, []);

  useEffect(() => {
    const peer = (peerRef.current = new Peer());

    peer
      .on('open', (id) => {
        console.log('[host] peer open', id);
        setHostId(id);
      })
      .on('connection', (connection) => {
        updateConnection(connection.peer, connection);

        connection
          .on('open', () => {
            // Example handshake; customize for your game protocol.
            connection.send({ type: 'hello', hostId: peer.id });
          })
          .on('data', (data) => {
            // Handle game messages here. For now, just log them.
            console.log('[host] received', { from: connection.peer, data: data as TData });
            setMessage({ from: connection.peer, data: data as TData });
          })
          .on('iceStateChanged', (s) => {
            if (s === 'disconnected' || s === 'closed' || s === 'failed') {
              updateConnection(connection.peer, null);
            }
          })
          .on('close', () => {
            updateConnection(connection.peer, null);
          })
          .on('error', (err) => {
            console.error('[host] conn error', err);
            updateConnection(connection.peer, null);
          });
      })
      .on('error', (err) => {
        console.error('[host] peer error', err);
      })
      .on('disconnected', () => {
        console.warn('[host] disconnected from broker; attempting reconnect');
        peer.reconnect();
      });

    return () => {
      setConnections((connections) => {
        for (const conn of connections.values()) {
          try {
            conn.close();
          } catch {
            // ignore
          }
        }

        return new Map();
      });

      try {
        peer.destroy();
      } finally {
        peerRef.current = null;
      }
    };
  }, [updateConnection]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('ping');

      for (const connection of connections.values()) {
        connection.send({});
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [connections]);

  const send = useCallback(
    (id: string, data: TData) => {
      const connection = connections.get(id);

      if (!connection) {
        return;
      }

      connection.send(data);
    },
    [connections]
  );

  return {
    hostId,
    connections,
    message,
    send,
  };
};

export const useP2PClient = <TData>() => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'>('idle');
  const [lastError, setLastError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ data: TData } | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  const disconnect = () => {
    try {
      connRef.current?.close();
    } catch {
      // ignore
    } finally {
      connRef.current = null;
    }
  };

  useEffect(() => {
    const peer = (peerRef.current = new Peer());

    peer
      .on('open', (id) => {
        console.log('[join] peer open', id);
      })
      .on('error', (err) => {
        console.error('[join] peer error', err);
        setLastError(err instanceof Error ? err.message : String(err));
        setStatus('error');
      });

    return () => {
      disconnect();

      try {
        peer.destroy();
      } finally {
        peerRef.current = null;
      }
    };
  }, []);

  const join = useCallback((hostId: string) => {
    const peer = peerRef.current;
    if (!peer || !hostId) return;

    setLastError(null);
    setStatus('connecting');

    disconnect();

    const conn = (connRef.current = peer.connect(hostId, {
      reliable: true,
    }));

    conn
      .on('open', () => {
        setStatus('connected');
        conn.send({ type: 'hello-from-join' });
      })
      .on('data', (data) => {
        console.log('[join] received', data as TData);
        setMessage({ data: data as TData });
      })
      .on('close', () => {
        setStatus('disconnected');
      })
      .on('error', (err) => {
        console.error('[join] conn error', err);
        setLastError(err instanceof Error ? err.message : String(err));
        setStatus('error');
      });
  }, []);

  const send = useCallback((data: TData) => {
    if (!connRef.current) {
      return;
    }

    connRef.current.send(data);
  }, []);

  return {
    join,
    lastError,
    status,
    message,
    send,
  };
};
