import './App.css';
import React from 'react';
import wordList from './words.json';

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const GUESSES = 6;
const WORD_LENGTH = 5;

const NORMAL_KEY = '#dddddd';
const PERFECT_KEY = '#00ff00';
const OK_KEY = '#ffff00';
const BAD_KEY = '#888888';

const NORMAL_CELL = '#dddddd';
const PERFECT_CELL = '#00ff00';
const OK_CELL = '#ffff00';
const BAD_CELL = '#888888';

let gameArea: GameArea;
let keyBoard: KeyBoard;

class Key extends React.Component<{ id: string; color: string }> {
  state = {};

  render() {
    const text = this.props.id;
    return (
      <button
        className="key"
        style={{ backgroundColor: this.props.color }}
        onClick={function () {
          gameArea.letterPressed(text);
        }}
      >
        {text}
      </button>
    );
  }
}

class EnterKey extends Key {
  render() {
    return (
      <button
        className="key"
        onClick={function () {
          gameArea.enterPressed();
        }}
      >
        {'Enter'}
      </button>
    );
  }
}

class BkspKey extends Key {
  render() {
    return (
      <button
        className="key"
        onClick={function () {
          gameArea.bkspPressed();
        }}
      >
        {'Bksp'}
      </button>
    );
  }
}

class KeyBoard extends React.Component {
  state: {
    keys: Record<
      string,
      {
        id: string;
        color: string;
      }
    >;
  } = { keys: {} };

  constructor(props: NonNullable<unknown>) {
    super(props);
    keyBoard = this as KeyBoard;
    this.state.keys = {};
    this.createRow(0);
    this.createRow(1);
    this.createRow(2);
  }

  render() {
    const rows = [];
    const row0 = [...ROWS[0]].map((x) => this.state.keys[x]);
    const row1 = [...ROWS[1]].map((x) => this.state.keys[x]);
    rows.push(
      <div key="0">
        {row0.map((key) => (
          <Key id={key.id} color={key.color} key={row0.indexOf(key)} />
        ))}
      </div>
    );
    rows.push(
      <div key="1">
        {row1.map((key) => (
          <Key id={key.id} color={key.color} key={row1.indexOf(key)} />
        ))}
      </div>
    );
    const x = [...ROWS[2]].map((x) => this.state.keys[x]);
    const row2 = x.map((key) => <Key id={key.id} color={key.color} key={x.indexOf(key)} />);
    return (
      <div>
        {rows}
        <EnterKey id="Enter" color={PERFECT_KEY} />
        {row2}
        <BkspKey id="Bksp" color={PERFECT_KEY} />
      </div>
    );
  }

  createRow(row: number) {
    return [...ROWS[row]].map((e) => {
      return this.createKey(e);
    });
  }

  createKey(text: string) {
    const key = { id: text, color: NORMAL_KEY };
    const keys = this.state.keys;
    keys[text] = key;
    this.setState({ keys: keys });
    return key;
  }
}

class GameCell extends React.Component<{ id: string; color: string }> {
  state = {};

  render() {
    return (
      <button className="cell" style={{ backgroundColor: this.props.color }}>
        {this.props.id}
      </button>
    );
  }
}

class GameArea extends React.Component<NonNullable<unknown>> {
  state: {
    rowlist: {
      id: string;
      color: string;
    }[][];
  } = { rowlist: [] };
  i = 0;
  j = 0;
  answer = '';

  constructor(props: NonNullable<unknown>) {
    super(props);
    gameArea = this as GameArea;
    this.answer = '';
    this.state.rowlist = [];
    for (let i = 0; i < GUESSES; ++i) {
      this.state.rowlist.push([]);
      this.createRow(i);
    }

    this.initGame();
  }

  render() {
    return this.state.rowlist.map((row) => (
      <div key={this.state.rowlist.indexOf(row)}>
        {row.map((cell) => (
          <GameCell id={cell.id} color={cell.color} key={row.indexOf(cell)} />
        ))}
      </div>
    ));
  }

  createRow(row: number) {
    return Array.from({ length: WORD_LENGTH }).map((_, col) => {
      return this.createCell(row, col);
    });
  }

  createCell(row: number, col: number) {
    const cell = { id: '.', color: NORMAL_CELL };
    const newlist = this.state.rowlist;
    newlist[row][col] = cell;
    this.setState({ rowlist: newlist });
    return cell;
  }

  initGame() {
    const newlist = this.state.rowlist;
    for (let i = 0; i < GUESSES; ++i)
      for (let j = 0; j < WORD_LENGTH; ++j) {
        newlist[i][j].id = '.';
        newlist[i][j].color = NORMAL_CELL;
      }
    this.setState({ rowlist: newlist });
    this.i = 0;
    this.j = 0;
    this.answer = wordList[Math.floor(Math.random() * wordList.length)];
    console.log(this.answer);
  }

  letterPressed(text: string) {
    if (this.j === WORD_LENGTH) return;

    const newlist = this.state.rowlist;
    newlist[this.i][this.j].id = text;
    this.setState({ rowlist: newlist });
    this.j += 1;
  }

  bkspPressed() {
    if (this.j === 0) return;

    this.j -= 1;
    const newlist = this.state.rowlist;
    newlist[this.i][this.j].id = '.';
    this.setState({ rowlist: newlist });
  }

  enterPressed() {
    if (this.j !== WORD_LENGTH) return;

    let word = '';
    for (let j = 0; j < WORD_LENGTH; ++j) {
      word += this.state.rowlist[this.i][j].id;
    }

    const newlist = this.state.rowlist;
    if (!isValid(word)) {
      for (let j = 0; j < WORD_LENGTH; ++j) newlist[this.i][j].id = '.';
      this.setState({ rowlist: newlist });
      this.j = 0;
      return;
    } else {
      let keys = keyBoard.state.keys;
      for (let j = 0; j < WORD_LENGTH; ++j) {
        if (word[j] === this.answer[j]) {
          newlist[this.i][j].color = PERFECT_CELL;
          keys[word[j]].color = PERFECT_KEY;
        } else if (this.answer.includes(word[j])) {
          if (newlist[this.i][j].color !== PERFECT_CELL) newlist[this.i][j].color = OK_CELL;
          if (keys[word[j]].color !== PERFECT_KEY) keys[word[j]].color = OK_KEY;
        } else {
          newlist[this.i][j].color = BAD_CELL;
          keys[word[j]].color = BAD_KEY;
        }
      }
      keyBoard.setState({ keys: keys });
      this.setState({ rowlist: newlist });
      this.i += 1;
      this.j = 0;
      if (this.i === GUESSES || word === this.answer) {
        alert('Answer is ' + this.answer);
        keys = keyBoard.state.keys;
        ROWS.map((row) => [...row].map((x) => (keys[x].color = NORMAL_KEY)));
        keyBoard.setState({ keys: keys });
        this.initGame();
      }
    }
  }
}

function App() {
  document.addEventListener(
    'keydown',
    (e) => {
      const x = e.key.toUpperCase();

      if (x === 'ENTER') gameArea.enterPressed();
      else if (x === 'BACKSPACE') gameArea.bkspPressed();
      else if (x.length === 1 && x.match(/[a-z]/i)) gameArea.letterPressed(x);
    },
    false
  );
  return (
    <div className="App">
      <header className="App-header">
        <GameArea />
        <div style={{ height: '30px' }}></div>
        <KeyBoard />
      </header>
    </div>
  );
}

function isValid(word: string) {
  return wordList.includes(word);
}

export default App;
