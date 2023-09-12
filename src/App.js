import * as React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";

function Square({ value, onSquareClick, color }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ background: color }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentTurn }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }
  const result = calculateWinner(squares);
  const winner = result?.winner;
  const lines = result?.lines;

  let status;
  let squareColor = [
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
  ];
  if (winner) {
    status = "Winner: " + winner;
    for (let i = 0; i < lines.length; ++i) {
      squareColor[lines[i]] = "#0fc6e5";
    }
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  if (currentTurn === 9) status = "draw";

  return (
    <React.Fragment>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          color={squareColor[0]}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          color={squareColor[1]}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          color={squareColor[2]}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          color={squareColor[3]}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          color={squareColor[4]}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          color={squareColor[5]}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          color={squareColor[6]}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          color={squareColor[7]}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          color={squareColor[8]}
        />
      </div>
    </React.Fragment>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscOrder, setIsAscOrder] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function handleOrder() {
    setIsAscOrder(!isAscOrder);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <Button
          variant="text"
          className="order-button"
          onClick={() => jumpTo(move)}
          color="success"
        >
          {description}
        </Button>
      </li>
    );
  });

  if (!isAscOrder) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentTurn={currentMove}
        />
      </div>
      <div className="game-info">
        <Button
          variant="contained"
          className="reset-button"
          onClick={handleReset}
        >
          Game Reset
        </Button>
        <Button
          variant="outlined"
          className="order-button"
          onClick={handleOrder}
          color="secondary"
        >
          {isAscOrder ? "▲" : "▼"}
        </Button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let result = {
    winner: "",
    lines: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      result.winner = squares[a];
      result.lines = lines[i];
      return result;
    }
  }
  return null;
}
