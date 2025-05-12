import React, { useState } from "react";
import Cell from "../Cell/cell";
import "./debutBoard.css";

export default function DebutBoard({ onBack, openings }) {
  const [board] = useState(
    Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({row, col, color: (row + col) % 2 === 0 ? "white" : "black"}))
    )
  );

  const [currentOpeningIndex, setCurrentOpeningIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [pieces, setPieces] = useState(initFigures());

  const currentOpening = openings[currentOpeningIndex];
  const currentMoves = currentOpening.moves.slice(0, currentMoveIndex + 1);

  const handleExitToMenu = () => {
    if (window.confirm("Вы уверены, что хотите выйти в меню?")) {
      onBack();
    }
  };

  const applyMoves = () => {
    let tempPieces = initFigures();
    
    currentMoves.forEach(move => {
      tempPieces = makeMove(tempPieces, move.from, move.to);
    });
    
    setPieces(tempPieces);
  };

  const makeMove = (pieces, from, to) => {
    const newPieces = pieces.map(row => [...row]);
    const piece = newPieces[from.row][from.col];
    
    newPieces[to.row][to.col] = { ...piece, hasMoved: true };
    newPieces[from.row][from.col] = null;
    
    return newPieces;
  };

  const nextMove = () => {
    if (currentMoveIndex < currentOpening.moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      applyMoves();
    }
  };

  const prevMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      applyMoves();
    }
  };

  const nextOpening = () => {
    setCurrentOpeningIndex((currentOpeningIndex + 1) % openings.length);
    setCurrentMoveIndex(0);
    setPieces(initFigures());
  };

  const prevOpening = () => {
    setCurrentOpeningIndex((currentOpeningIndex - 1 + openings.length) % openings.length);
    setCurrentMoveIndex(0);
    setPieces(initFigures());
  };

  React.useEffect(() => {
    applyMoves();
  }, [currentMoveIndex]);

    return (
    <>
        <div className="board-background"></div>
        
        <div className="board-container">
        <div className="opening-info">
            <h2>{currentOpening.name}</h2>
            <h4>{currentOpening.description}</h4>
            <div className="move-navigation">
            <button onClick={prevOpening} className="nav-button">
                ← Предыдущий дебют
            </button>
            <button onClick={nextOpening} className="nav-button">
                Следующий дебют →
            </button>
            </div>
        </div>

        <div className="board" >
            {board.map((row, rowIndex) => (
            <div 
                key={rowIndex} 
                className="board-row" 
                
            >
                {row.map((cell, colIndex) => (
                <Cell
                    key={`${rowIndex}-${colIndex}`}
                    cell={cell}
                    piece={pieces[rowIndex][colIndex]}
                />
                ))}
            </div>
            ))}
        </div>

        <div className="move-controls">
            <button 
            onClick={prevMove}
            disabled={currentMoveIndex === 0}
            className="move-button"
            >
            ← Предыдущий ход
            </button>
            <div className="move-counter">
            Ход {currentMoveIndex + 1} из {currentOpening.moves.length}
            </div>
            <button 
            onClick={nextMove}
            disabled={currentMoveIndex === currentOpening.moves.length - 1}
            className="move-button"
            >
            Следующий ход →
            </button>

            <button 
                onClick={handleExitToMenu}
                className="exit-button"
            >
                <b>Выход в меню</b>
        </button>
        </div>
        </div>

        
    </>
    );
}

function initFigures() {
  const cells = Array(8).fill(null).map(() => Array(8).fill(null));

  for (let i = 0; i < 8; i++) {
    cells[1][i] = { type: "pawn", color: "black", hasMoved: false };
    cells[6][i] = { type: "pawn", color: "white", hasMoved: false };
  }

  cells[0][0] = { type: "rook", color: "black", hasMoved: false };
  cells[0][7] = { type: "rook", color: "black", hasMoved: false };
  cells[7][0] = { type: "rook", color: "white", hasMoved: false };
  cells[7][7] = { type: "rook", color: "white", hasMoved: false };

  cells[0][4] = { type: "king", color: "black", hasMoved: false };
  cells[7][4] = { type: "king", color: "white", hasMoved: false };

  cells[0][1] = { type: "knight", color: "black", hasMoved: false };
  cells[0][2] = { type: "bishop", color: "black", hasMoved: false };
  cells[0][3] = { type: "queen", color: "black", hasMoved: false };
  cells[0][5] = { type: "bishop", color: "black", hasMoved: false };
  cells[0][6] = { type: "knight", color: "black", hasMoved: false };

  cells[7][1] = { type: "knight", color: "white", hasMoved: false };
  cells[7][2] = { type: "bishop", color: "white", hasMoved: false };
  cells[7][3] = { type: "queen", color: "white", hasMoved: false };
  cells[7][5] = { type: "bishop", color: "white", hasMoved: false };
  cells[7][6] = { type: "knight", color: "white", hasMoved: false };
  
  return cells;
}