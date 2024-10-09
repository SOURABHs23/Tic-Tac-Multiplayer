import "./App.css";

import Square from "./component/Square.js";

function App() {
  return (
    <div className="main-div">
      <div>
        <h1 className="game-heading">Tic Tac Toe</h1>
        <div className="square-wrapper">
          <Square />
        </div>
      </div>
    </div>
  );
}

export default App;
