import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import Wordle from "./Wordle/App";
import Blocks from "./Blocks/App";

const appList = [
  { name: "Wordle", Component: Wordle },
  { name: "Blocks", Component: Blocks },
];

const App = () => {
  const [selected, setSelected] = useState("Wordle");

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {appList.map(({ name }) => {
          return <button onClick={() => setSelected(name)}>{name}</button>;
        })}
      </div>
      <div style={{ flex: 1 }}>
        {appList.map(({ name, Component }) => {
          return selected === name && <Component />;
        })}
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
