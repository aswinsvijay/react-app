import { useCallback, useEffect, useMemo, useState } from 'react';
import { shuffle, range } from 'es-toolkit';

type SimulationStep = {
  prisonerNo: number;
  current: number;
  win: boolean;
};

class Simulation {
  protected prisoners: number;
  protected chances: number;
  protected slips: number[];
  protected visited: Uint8Array;
  protected prisonerWin: Uint8Array;

  constructor(prisoners: number, chances: number) {
    this.prisoners = prisoners;
    this.chances = chances;
    this.slips = range(prisoners);
    this.visited = new Uint8Array(prisoners);
    this.prisonerWin = new Uint8Array(prisoners);
  }

  getAllWin() {
    return this.prisonerWin.every((x) => x);
  }

  *run(): Generator<SimulationStep, void, unknown> {
    this.slips = shuffle(this.slips);
    this.visited.fill(0);
    this.prisonerWin.fill(1);

    for (const prisonerNo of range(this.prisoners)) {
      let current = prisonerNo;

      if (this.visited[prisonerNo]) {
        yield { prisonerNo, current, win: this.getAllWin() };
        continue;
      }

      let winInner = false;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of range(this.chances)) {
        this.visited[current] = 1;
        current = this.slips[current];

        yield { prisonerNo, current, win: this.getAllWin() };

        winInner ||= current === prisonerNo;

        if (winInner) {
          break;
        }
      }

      this.prisonerWin[prisonerNo] = winInner ? 1 : 0;
    }
  }

  *[Symbol.iterator]() {
    yield* this.run();
  }
}

const App: React.FC<NonNullable<unknown>> = () => {
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);
  const [chances, setChances] = useState(50);
  const prisoners = useMemo(() => rows * columns, [rows, columns]);

  const [simulationState, setSimulationState] = useState<
    SimulationStep & {
      visited: Simulation['visited'];
      slips: Simulation['slips'];
      prisonerWin: Simulation['prisonerWin'];
    }
  >({
    current: 0,
    prisonerNo: 0,
    visited: new Uint8Array(),
    prisonerWin: new Uint8Array(),
    slips: [],
    win: true,
  });

  const getIndex = useCallback(
    (i: number, j: number) => {
      return i * columns + j;
    },
    [columns]
  );

  const controls = useMemo((): { name: string; value: number; setValue: (value: number) => void }[] => {
    return [
      {
        name: 'Rows',
        value: rows,
        setValue: setRows,
      },
      {
        name: 'Columns',
        value: columns,
        setValue: setColumns,
      },
      {
        name: 'Chances',
        value: chances,
        setValue: setChances,
      },
    ];
  }, [rows, columns, chances]);

  useEffect(() => {
    const simulation = new Simulation(prisoners, chances);
    let gen = simulation.run();

    const interval = setInterval(() => {
      const state = gen.next();

      if (!state.done) {
        const data = {
          ...state.value,
          visited: simulation['visited'],
          slips: simulation['slips'],
          prisonerWin: simulation['prisonerWin'],
        };

        setSimulationState(data);
      } else {
        gen = simulation.run();
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [prisoners, chances]);

  return (
    <div className="App" tabIndex={0}>
      <header className="App-header" style={{ justifyContent: 'unset', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {controls.map((control) => {
              return (
                <div key={control.name} style={{ display: 'flex', flexDirection: 'column' }}>
                  <label>{control.name}</label>
                  <input
                    type="number"
                    value={control.value}
                    onChange={(e) => {
                      control.setValue(e.target.valueAsNumber);
                    }}
                  />
                </div>
              );
            })}
          </div>
          {`${simulationState.win}`}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {range(rows).map((i) => {
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                  {range(columns).map((j) => {
                    const index = getIndex(i, j);
                    const isVisited = simulationState.visited[index];
                    const iscurrent = simulationState.current === index;

                    return (
                      <div
                        key={j}
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: iscurrent ? 'gray' : isVisited ? 'green' : 'red',
                          fontSize: '14px',
                        }}
                      >
                        <div style={{ width: '100%', height: '20px' }}>{`${simulationState.prisonerWin[index]}`}</div>
                        Box: {index}, Slip: {simulationState.slips[index]}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
