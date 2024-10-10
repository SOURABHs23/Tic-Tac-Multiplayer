import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import Square from "./component/Square";
import Swal from "sweetalert2";

const renderForm = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {
  const [gameState, setGameState] = useState(renderForm);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);

  const checkWinner = () => {
    // row dynamic
    for (let row = 0; row < gameState.length; row++) {
      if (
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0];
      }
    }

    // column dynamic
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }

    if (
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]
    ) {
      setFinishedArrayState([0, 4, 8]);
      return gameState[0][0];
    }

    if (
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0]
    ) {
      setFinishedArrayState([2, 4, 6]);
      return gameState[0][2];
    }

    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return true;
    });
    // console.log(isDrawMatch + "k");

    if (isDrawMatch) return "draw";

    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      console.log(winner);
      setFinishedState(winner);
    }
  }, [gameState]);

  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });
    return result;
  };

  async function playOnlineClick() {
    const result = await takePlayerName();
    console.log(result);

    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);

    const newsocket = io("http://localhost:4000/", {
      autoConnect: true,
    });
    newsocket?.emit("request_to_play", { playerName: username });
    setSocket(newsocket);
  }

  if (!playOnline) {
    return (
      <div className="main-div">
        <button onClick={playOnlineClick} className="playOnline">
          Play Online
        </button>
      </div>
    );
  }

  if (playOnline && !opponentName) {
    return (
      <div className="waiting">
        <p>Waiting for opponent</p>
      </div>
    );
  }

  return (
    <div className="main-div">
      <div className="move-detection">
        <div className="left"> yourself </div>
        <div className="right"> opponent</div>
      </div>
      <div>
        <h1 className="game-heading">Tic Tac Toe</h1>
        <div className="square-wrapper">
          {gameState.map((arr, rowInd) =>
            arr.map((e, colInd) => {
              // console.log(e + "e");
              return (
                <Square
                  key={rowInd * 3 + colInd}
                  id={rowInd * 3 + colInd}
                  setGameState={setGameState}
                  currentPlayer={currentPlayer}
                  setCurrentPlayer={setCurrentPlayer}
                  finishedState={finishedState}
                  finishedArrayState={finishedArrayState}
                />
              );
            })
          )}
        </div>
      </div>
      {finishedState && finishedState !== "draw" && (
        <h3 className="finished-state"> {finishedState} Won the Game</h3>
      )}
      {finishedState && finishedState === "draw" && (
        <h3 className="finished-state"> It's Draw </h3>
      )}
    </div>
  );
};

export default App;
