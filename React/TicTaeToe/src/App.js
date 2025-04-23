import { useState } from "react";

function Square({value, onSquareClick, className}){
  
  return <button className={`square ${className}`}
    onClick={onSquareClick}
    >
      {value}
    </button>;
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i){
    if(squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O' ;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares)?.winner;
  const winningLine = calculateWinner(squares)?.winning;
  let status;
  if(winner){
    status = 'Winner: ' + winner;
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    < div className="box">
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}
        className={winningLine?.includes(0) ? "winning" : ""}
        />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}
        className={winningLine?.includes(1) ? "winning" : ""}
        />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}
        className={winningLine?.includes(2) ? "winning" : ""}
        />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}
        className={winningLine?.includes(3) ? "winning" : ""}
        />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}
        className={winningLine?.includes(4) ? "winning" : ""}
        />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}
        className={winningLine?.includes(5) ? "winning" : ""}
        />
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}
        className={winningLine?.includes(6) ? "winning" : ""}
        />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}
        className={winningLine?.includes(7) ? "winning" : ""}
        />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} 
        className={winningLine?.includes(8) ? "winning" : ""}
        />
      </div>
      <div className="status">{status}</div>
    </ div>
    
  );
}

export default function Game(){

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];


  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setxIsNext(!xIsNext);
  }

  function jupmTo(nextMove){
    setCurrentMove(nextMove);
  }


  const moves = history.map((squares, move)=> {
    let description;
    if(move>0){
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game Start';
    }
    return (
      <li key={move}>
        {/* <button onClick={()=> jupmTo(move)}>
          {description}
        </button> */}
        {description}
      </li>
    );
  });

  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


function calculateWinner(squares){
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
  ];
  for(let i = 0; i < lines.length; i++){
  const [a,b,c] = lines[i];
  if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
    return {
      winner: squares[a],
      winning: [a,b,c]}
  }
  }
  return null;
}


