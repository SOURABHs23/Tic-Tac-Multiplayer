import React, { useState } from "react";
import "./Square.css";

const Square = (props) => {
  const [icon, setIcon] = useState(null);
  const {
    id,
    setGameState,
    currentPlayer,
    setCurrentPlayer,
    finishedState,
    finishedArrayState,
  } = props;

  const clickOnSquare = () => {
    // console.log(finishedState + "fdd");
    if (finishedState) return;
    if (!icon) {
      if (currentPlayer === "circle") {
        setIcon("O");
      } else setIcon("X");
    }
    const myCurrplayer = currentPlayer;
    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
    console.log(id);
    setGameState((prevState) => {
      let newState = [...prevState];
      const rowInd = Math.floor(id / 3);
      const colInd = id % 3;
      newState[rowInd][colInd] = myCurrplayer;
      // console.log(newState);
      return newState;
    });
  };

  // console.log(id + " id");
  return (
    <div
      className={`square ${finishedState ? "not-allowed" : ""} ${
        finishedArrayState.includes(id) ? finishedState + "-won" : ""
      } `}
      onClick={clickOnSquare}
    >
      <div> {icon}</div>
    </div>
  );
};

export default Square;
