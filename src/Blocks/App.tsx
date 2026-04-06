import './App.css';
import React from 'react';

const N = 4;
let my_app: MyApp;

class Cell extends React.Component<{ number: number }> {
  render() {
    let text: string;
    if (this.props.number === 0) text = '.';
    else text = this.props.number.toString();

    return <button className="cell">{text}</button>;
  }
}

class MyApp extends React.Component {
  state: { cells: number[][] } = { cells: [] };

  constructor(props: NonNullable<unknown>) {
    super(props);
    my_app = this as MyApp;

    const cells: number[][] = [];
    for (let i = 0; i < N; ++i) {
      cells.push([]);
      for (let j = 0; j < N; ++j) {
        cells[i].push(0);
      }
    }
    this.state.cells = cells;
    this.init_game();
  }

  init_game() {
    let solvable = false;
    const cells = this.state.cells;
    while (!solvable) {
      const nums: number[] = [];
      let i: number, j: number;
      for (i = 0; i < N * N; ++i) nums.push(i);

      const random: number[] = [];
      i = nums.length;
      while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        random.push(nums[j]);
        nums.splice(j, 1);
      }

      for (i = 0; i < N; ++i)
        for (j = 0; j < N; ++j) {
          cells[i][j] = random[i * N + j];
        }
      solvable = this.is_solvable();
      console.log(solvable);
    }
    this.setState({ cells: cells });
  }

  is_solvable() {
    const inv = this.count_inv();
    let i: number, from_bottom: number;
    if (N % 2) return inv % 2 === 0;
    else {
      i = this.find_blank()[0];
      from_bottom = N - i;
      if (from_bottom % 2) return inv % 2 === 0;
      else return inv % 2 !== 0;
    }
  }

  count_inv() {
    const flat: number[] = [];
    let i: number, j: number;
    for (i = 0; i < N; ++i) for (j = 0; j < N; ++j) flat.push(this.state.cells[i][j]);

    let count = 0;
    for (i = 0; i < N * N - 1; ++i) {
      for (j = i; j < N * N; ++j) {
        if (flat[i] && flat[j] && flat[i] > flat[j]) ++count;
      }
    }
    return count;
  }

  find_blank() {
    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < N; ++j) {
        if (this.state.cells[i][j] === 0) return [i, j] as const;
      }
    }
    return [0, 0] as const;
  }

  onKeyDown(key: string) {
    if (!key.includes('Arrow')) return;
    const [i1, j1] = this.find_blank();

    let i2: number, j2: number;
    if (key === 'ArrowDown') [i2, j2] = [i1 - 1, j1];
    else if (key === 'ArrowUp') [i2, j2] = [i1 + 1, j1];
    else if (key === 'ArrowRight') [i2, j2] = [i1, j1 - 1];
    else if (key === 'ArrowLeft') [i2, j2] = [i1, j1 + 1];
    else [i2, j2] = [i1, j1];
    if (i2 < 0 || i2 >= N || j2 < 0 || j2 >= N) return;

    const cells = this.state.cells;
    const text1 = cells[i1][j1];
    const text2 = cells[i2][j2];
    cells[i1][j1] = text2;
    cells[i2][j2] = text1;
    this.setState({ cells: cells });
  }

  render() {
    const cells = this.state.cells;
    return cells.map((row) => (
      <div key={cells.indexOf(row)}>
        {row.map((cell) => (
          <Cell number={cell} key={row.indexOf(cell)} />
        ))}
      </div>
    ));
  }
}

function App() {
  return (
    <div
      className="App"
      onKeyDown={(key) => {
        console.log(key.code);
        my_app.onKeyDown(key.code);
      }}
      tabIndex={0}
    >
      <header className="App-header">
        <MyApp />
      </header>
    </div>
  );
}

export default App;
