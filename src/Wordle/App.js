import './App.css';
import React from 'react'
import wordList from './words.js'

let ROWS = [
  'QWERTYUIOP',
  'ASDFGHJKL',
  'ZXCVBNM'
]
let GUESSES = 6
let WORD_LENGTH = 5

let NORMAL_KEY = '#dddddd'
let PERFECT_KEY = '#00ff00'
let OK_KEY = '#ffff00'
let BAD_KEY = '#888888'

let NORMAL_CELL = '#dddddd'
let PERFECT_CELL = '#00ff00'
let OK_CELL = '#ffff00'
let BAD_CELL = '#888888'

var gameArea;
var keyBoard;

class Key extends React.Component {
  state = {}

  render() {
    var text = this.props.id
    return (
      <button className="key" style={{backgroundColor: this.props.color}} onClick={function() {
        gameArea.letterPressed(text)
      }}>
        {text}
      </button>
    );
  }
}

class EnterKey extends Key {
  render() {
    var text = 'Enter'
    return (
      <button className="key" onClick={function() {
        gameArea.enterPressed()
      }}>
        {text}
      </button>
    );
  }
}

class BkspKey extends Key {
  render() {
    var text = 'Bksp'
    return (
      <button className="key" onClick={function() {
        gameArea.bkspPressed()
      }}>
        {text}
      </button>
    );
  }
}

class KeyBoard extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    keyBoard = this;
    this.state.keys = {};
    this.createRow(0)
    this.createRow(1)
    this.createRow(2)
  }

  render() {
    var rows = [];
    var row0 = [...ROWS[0]].map(x => this.state.keys[x])
    var row1 = [...ROWS[1]].map(x => this.state.keys[x])
    rows.push(<div key='0'>{
      row0.map(key =>
        <Key id={key.id} color={key.color} key={row0.indexOf(key)}/>
      )
    }</div>);
    rows.push(<div key='1'>{
      row1.map(key =>
        <Key id={key.id} color={key.color} key={row1.indexOf(key)}/>
      )
    }</div>);
    var x = [...ROWS[2]].map(x => this.state.keys[x])
    var row2 = x.map(key =>
      <Key id={key.id} color={key.color} key={x.indexOf(key)}/>
    )
    return (
      <div>
        {rows}
        <EnterKey/>
        {row2}
        <BkspKey/>
      </div>
    );
  }

  createRow(row) {
    var keys = [];
    [...ROWS[row]].forEach(e => {
      keys.push(this.createKey(e))
    });
    return (
      keys
    );
  }

  createKey(text) {
    var key = {id: text, color: NORMAL_KEY};
    var keys = this.state.keys;
    keys[text] = key;
    this.setState({keys: keys});
    return (key);
  }
}

class GameCell extends React.Component {
  state = {}

  render() {
    return (
        <button className="cell" style={{backgroundColor: this.props.color}}>
          {this.props.id}
        </button>
    );
  }
}

class GameArea extends React.Component {
  state = {}

  constructor(props) {
    super(props);
    gameArea = this
    this.i = 0;
    this.j = 0;
    this.state.rowlist = [];
    for (var i = 0; i < GUESSES; ++i) {
      this.state.rowlist.push([])
    }

    for (i = 0; i < GUESSES; ++i) {
      this.state.rowlist[i] = this.createRow(i);
    }

    this.initGame()
  }

  render() {
    return (
      this.state.rowlist.map(row =>
        <div key={this.state.rowlist.indexOf(row)}>{
          row.map(cell =>
            <GameCell id={cell.id} color={cell.color} key={row.indexOf(cell)}/>
          )
        }</div>
      )
    );
  }

  createRow(row) {
    var cells = [];
    for (var col = 0; col < WORD_LENGTH; ++col) {
      cells.push(this.createCell(row, col));
    }
    return (cells);
  }

  createCell(row, col) {
    var cell = {id: '.', color: NORMAL_CELL}
    var newlist = this.state.rowlist
    newlist[row][col] = cell;
    this.setState({rowlist: newlist})
    return (cell)
  }

  initGame() {
    var newlist = this.state.rowlist
    for (var i = 0; i < GUESSES; ++i)
      for (var j = 0; j < WORD_LENGTH; ++j) {
        newlist[i][j].id = '.'
        newlist[i][j].color = NORMAL_CELL
      }
    this.setState({rowlist: newlist})
    this.i = 0;
    this.j = 0;
    this.answer = wordList[Math.floor(Math.random()*wordList.length)];
    console.log(this.answer)
  }

  letterPressed(text) {
    if (this.j === WORD_LENGTH)
      return;

    var newlist = this.state.rowlist
    newlist[this.i][this.j].id = text;
    this.setState({rowlist: newlist});
    this.j += 1;
  }

  bkspPressed() {
    if (this.j === 0)
      return;

    this.j -= 1
    var newlist = this.state.rowlist;
    newlist[this.i][this.j].id = '.'
    this.setState({rowlist: newlist});
  }

  enterPressed() {
    if (this.j !== WORD_LENGTH)
      return;

    var word = '';
    for (var j = 0; j < WORD_LENGTH; ++j) {
      word += this.state.rowlist[this.i][j].id;
    }

    if (!isValid(word)) {
      var newlist = this.state.rowlist
      for (j = 0; j < WORD_LENGTH; ++j)
        newlist[this.i][j].id = '.'
      this.setState({rowlist: newlist});
      this.j = 0;
      return;
    }
    else {
      newlist = this.state.rowlist
      var keys = keyBoard.state.keys;
      for (j = 0; j < WORD_LENGTH; ++j) {
        if (word[j] === this.answer[j]) {
          newlist[this.i][j].color = PERFECT_CELL;
          keys[word[j]].color = PERFECT_KEY;
        }
        else if (this.answer.includes(word[j])) {
          if (newlist[this.i][j].color !== PERFECT_CELL)
            newlist[this.i][j].color = OK_CELL;
          if (keys[word[j]].color !== PERFECT_KEY)
            keys[word[j]].color = OK_KEY;
        }
        else {
          newlist[this.i][j].color = BAD_CELL;
          keys[word[j]].color = BAD_KEY;
        }
      }
      keyBoard.setState({keys: keys})
      this.setState({rowlist: newlist});
      this.i += 1
      this.j = 0
      if (this.i === GUESSES || word === this.answer) {
        alert("Answer is " + this.answer);
        keys = keyBoard.state.keys;
        ROWS.map(row =>
          [...row].map(x => keys[x].color = NORMAL_KEY)
        )
        keyBoard.setState({keys: keys})
        this.initGame()
      }
    }
  }
}

function App() {
  document.addEventListener("keydown", keyDown, false);
  return (
    <div className="App">
      <header className="App-header">
        <GameArea/>
        <div style={{height: '30px'}}></div>
        <KeyBoard/>
      </header>
    </div>
  );
}

function keyDown(x) {
  x = x.key.toUpperCase();

  if (x === "ENTER")
    gameArea.enterPressed()
  else if (x === "BACKSPACE")
    gameArea.bkspPressed()
  else if (x.length === 1 && x.match(/[a-z]/i))
    gameArea.letterPressed(x)
}

function isValid(word) {
  return wordList.includes(word)
}

export default App;
