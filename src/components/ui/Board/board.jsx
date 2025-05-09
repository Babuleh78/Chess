import React from "react";
import { useState } from "react";
import Cell from "../Cell/cell";
import "./board.css";

export default function Board() {
  const [board] = useState(
    Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({
        row,
        col,
        color: (row + col) % 2 === 0 ? "white" : "black"
      }))
    )
  );

  const [pieces, setPieces] = useState(initFigures());
  const [selectedCell, setSelectedCell] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("white");

  const handleCellClick = (row, col) => {
    // Если клетка уже выбрана - снимаем выбор
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      setSelectedCell(null);
      setPossibleMoves([]);
      return;
    }

    // Если фигура уже выбрана и клик на возможный ход - перемещаем
    if (selectedCell && possibleMoves.some(move => move.row === row && move.col === col)) {
      const newPieces = [...pieces.map(row => [...row])];
      newPieces[row][col] = newPieces[selectedCell.row][selectedCell.col];
      newPieces[selectedCell.row][selectedCell.col] = null;
      setPieces(newPieces);
      setSelectedCell(null);
      setPossibleMoves([]);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      return;
    }

    // Если на клетке есть фигура текущего игрока - выбираем ее
    const piece = pieces[row][col];
    if (piece && piece.color === currentPlayer) {
      setSelectedCell({ row, col });
      calculatePossibleMoves(row, col, piece);
    }
  };

  const calculatePossibleMoves = (row, col, piece) => {
    const moves = [];
    
    // Простая реализация только для пешек (для демонстрации)
    if (piece.type === "pawn") {
      const direction = piece.color === "white" ? -1 : 1;
      
      // Ход на одну клетку вперед
      if (row + direction >= 0 && row + direction < 8 && !pieces[row + direction][col]) {
        moves.push({ row: row + direction, col });
        
        // Первый ход на две клетки
        if ((piece.color === "white" && row === 6) || (piece.color === "black" && row === 1)) {
          if (!pieces[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
          }
        }
      }
      
      // Взятие фигур по диагонали
      for (const dc of [-1, 1]) {
        const newCol = col + dc;
        if (newCol >= 0 && newCol < 8) {
          const targetPiece = pieces[row + direction][newCol];
          if (targetPiece && targetPiece.color !== piece.color) {
            moves.push({ row: row + direction, col: newCol });
          }
        }
      }
    }
    
    setPossibleMoves(moves);
  };

  return (
    <div className="board-container">
      <div className="current-player">Current player: {currentPlayer}</div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                piece={pieces[rowIndex][colIndex]}
                isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
                isPossibleMove={possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
function initFigures (){
  const cells = Array(8).fill(null).map(()=> Array(8).fill(null));

  for (let i = 0; i < 8; i++) { // пешки
    cells[1][i] = { type: "pawn", color: "black" };
    cells[6][i] = { type: "pawn", color: "white" };
  }


  cells[0][0]  = {type: "rook", color: "black"}
  cells[0][1]  = {type: "knight", color: "black"}
  cells[0][2]  = {type: "bishop", color: "black"}
  cells[0][3]  = {type: "queen", color: "black"}
  cells[0][4]  = {type: "king", color: "black"}
  cells[0][5]  = {type: "bishop", color: "black"}
  cells[0][6]  = {type: "knight", color: "black"}
  cells[0][7]  = {type: "rook", color: "black"}

  cells[7][0]  = {type: "rook", color: "white"}
  cells[7][1]  = {type: "knight", color: "white"}
  cells[7][2]  = {type: "bishop", color: "white"}
  cells[7][3]  = {type: "queen", color: "white"}
  cells[7][4]  = {type: "king", color: "white"}
  cells[7][5]  = {type: "bishop", color: "white"}
  cells[7][6]  = {type: "knight", color: "white"}
  cells[7][7]  = {type: "rook", color: "white"}
  
  return cells

}

