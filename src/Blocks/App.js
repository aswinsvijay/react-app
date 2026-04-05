import './App.css';
import React from 'react';

var N = 4;
var my_app;

class Cell extends React.Component {
  render() {
    var text;
    if (this.props.number === 0)
      text = ".";
    else
      text = this.props.number;

    return <button className="cell">
      {text}
    </button>;
  }
}

class MyApp extends React.Component {
  state = {};

  constructor(props) {
    super(props);
    my_app = this;

    var cells = [];
    for (var i=0 ; i<N ; ++i) {
      cells.push([]);
      for (var j=0 ; j<N ; ++j) {
        cells[i].push(null);
      }
    }
    this.state.cells = cells;
    this.init_game()
  }

  init_game() {
    var solvable = false;
    while (!solvable) {
      var nums = [];
      var i, j;
      for (i=0 ; i<N*N ; ++i)
        nums.push(i);

      var random = [];
      i = nums.length;
      while (i--) {
        j = Math.floor(Math.random()*(i+1));
        random.push(nums[j]);
        nums.splice(j, 1);
      }

      var cells = this.state.cells;
      for (i=0 ; i<N ; ++i)
        for (j=0 ; j<N ; ++j) {
          cells[i][j] = random[i*N+j];
        }
      solvable = this.is_solvable();
      console.log(solvable);
    }
    this.setState({cells: cells})
  }

  is_solvable() {
    var inv = this.count_inv();
    var i, from_bottom;
    if (N%2)
      return inv%2===0;
    else {
      i = this.find_blank()[0];
      from_bottom = N-i;
      if (from_bottom%2)
        return inv%2===0;
      else
        return inv%2!==0;
    }
  }

  count_inv() {
    var flat = [];
    var i, j;
    for (i=0 ; i<N ; ++i)
      for (j=0 ; j<N ; ++j)
        flat.push(this.state.cells[i][j]);

    var count = 0;
    for (i=0 ; i<N*N-1 ; ++i)
      for (j=i ; j<N*N ; ++j)
        if (flat[i] && flat[j] && flat[i]>flat[j])
          ++count;
    return count;
  }

  find_blank() {
    for (var i=0 ; i<N ; ++i)
      for (var j=0 ; j<N ; ++j)
        if (this.state.cells[i][j] === 0)
          return [i, j];
  }

  onKeyDown(key) {
    if (!key.includes("Arrow"))
      return;
    var blank_pos = this.find_blank();
    var i1 = blank_pos[0];
    var j1 = blank_pos[1];

    var i2, j2;
    if (key==="ArrowDown")
      [i2, j2] = [i1-1, j1];
    else if (key==="ArrowUp")
      [i2, j2] = [i1+1, j1];
    else if (key==="ArrowRight")
      [i2, j2] = [i1, j1-1];
    else if (key==="ArrowLeft")
      [i2, j2] = [i1, j1+1];
    if (i2<0 || i2>=N || j2<0 || j2>=N)
      return;

    var cells = this.state.cells;
    var text1 = cells[i1][j1];
    var text2 = cells[i2][j2];
    cells[i1][j1] = text2;
    cells[i2][j2] = text1;
    this.setState({cells: cells});
  }

  render() {
    var cells = this.state.cells;
    return (
      cells.map(row =>
        <div key={cells.indexOf(row)}>{
          row.map(cell =>
            <Cell number={cell} key={row.indexOf(cell)}/>)
        }</div>
      )
    );
  }
}

function onKeyDown(key) {
  console.log(key.code);
  my_app.onKeyDown(key.code);
}

function App() {
  return (
    <div className="App" onKeyDown={onKeyDown} tabIndex="0">
      <header className="App-header">
        <MyApp/>
      </header>
    </div>
  );
}

export default App;
