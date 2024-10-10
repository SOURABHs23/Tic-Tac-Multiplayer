import React, { useState } from "react";
import "./Square.css";

const Square = (props) => {
  const [icon, setIcon] = useState(null);
  const {
    id,
    socket,
    gameState,
    playingAs,
    currentElement,
    setGameState,
    currentPlayer,
    setCurrentPlayer,
    finishedState,
    finishedArrayState,
  } = props;

  const clickOnSquare = () => {
    // console.log(finishedState + "fdd");
    const rowInd = Math.floor(id / 3);
    const colInd = id % 3;
    if (
      gameState[rowInd][colInd] == "circle" ||
      gameState[rowInd][colInd] == "cross"
    )
      return;

    if (playingAs !== currentPlayer) return;
    if (finishedState) return;
    if (!icon) {
      if (currentPlayer === "circle") {
        setIcon("O");
      } else setIcon("X");
    }
    const myCurrplayer = currentPlayer;

    socket.emit("playerMoveFromClient", {
      state: {
        id,
        sign: myCurrplayer,
      },
    });
    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
    console.log(id);

    setGameState((prevState) => {
      let newState = [...prevState];
      newState[rowInd][colInd] = myCurrplayer;
      // console.log(newState);
      return newState;
    });
  };

  // console.log(id + " id");
  return (
    <div
      className={`square ${finishedState ? "not-allowed" : ""}
       ${currentPlayer !== playingAs ? "not-allowed" : ""}
      ${finishedArrayState.includes(id) ? finishedState + "-won" : ""}
      ${finishedState && finishedState !== playingAs ? "grey-background" : ""}
      `}
      onClick={clickOnSquare}
    >
      <div>
        {currentElement === "circle"
          ? "O"
          : currentElement === "cross"
          ? "X"
          : icon}
        {/* {icon} */}
      </div>
    </div>
  );
};

export default Square;
