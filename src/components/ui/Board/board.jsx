import React from "react";
import { useState } from "react";
import Cell from "../Cell/cell";
import "./board.css";

export default function Board() {
  const [board] = useState(
    Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({row,col,  color: (row + col) % 2 === 0 ? "white" : "black"}))
    )
  );

  const [pieces, setPieces] = useState(initFigures());
  const [selectedCell, setSelectedCell] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("white");

  const handleCellClick = (row, col) => {
    
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) { // Клетка уже выбрана
      setSelectedCell(null);
      setPossibleMoves([]);
      return;
    }

    if (selectedCell && possibleMoves.some(move => move.row === row && move.col === col)) { // Фигура выбрана и есть возможный ход, двигаем
      const newPieces = [...pieces.map(row => [...row])];
      newPieces[row][col] = newPieces[selectedCell.row][selectedCell.col];
      newPieces[selectedCell.row][selectedCell.col] = null;
      setPieces(newPieces);
      setSelectedCell(null);
      setPossibleMoves([]);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      return;
    }

    const piece = pieces[row][col];
    if (piece && piece.color === currentPlayer) {
      setSelectedCell({ row, col });
      calculatePossibleMoves(row, col, piece);
    }
  };

  const calculatePossibleMoves = (row, col, piece) => {
    const moves = [];
    const direction = piece.color === "white" ? -1 : 1; // Белые вверх, черные вниз ( по хорошему потом добавить переворот доски)

    if (piece.type === "pawn") {
      
      if (row + direction >= 0 && row + direction < 8 && !pieces[row + direction][col]) { // Можем двинуться вперед на 1
        moves.push({ row: row + direction, col });
        
        if ((piece.color === "white" && row === 6) || (piece.color === "black" && row === 1)) { // Первый ход на две клетки
          if (!pieces[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
          }
        }
      }
      
      for (const columns of [-1, 1]) { // Диагональ
        const newCol = col + columns;
        if (newCol >= 0 && newCol < 8) {
          const targetPiece = pieces[row + direction][newCol];
          if (targetPiece && targetPiece.color !== piece.color) {
            moves.push({ row: row + direction, col: newCol });
          }
        }
      }
    }

    if (piece.type === "rook") {
    // Движение по вертикали вверх и вниз
      for (let dir of [-1, 1]) { //-1 - вниз, 1 - вверх
        for (let i = 1; i<8;i++) {
          const newRow = row+i * dir
          if(newRow<0 || newRow>=8) break

          if(!pieces[newRow][col]){
            moves.push({row: newRow, col})
          } 
          else{

              if(pieces[newRow][col].color !== piece.color){
                moves.push({row: newRow, col})
              }
              break
              
            }
          }
        }
    
      // Движение по горизонтали вправо влево
      for (let dir of [-1, 1]) { //-1 - влево, 1 - вправо
        for( let i = 1; i < 8; i++ ){
          const newCol = col + i * dir

          if(newCol<0 || newCol>=8) break

          if(!pieces[row][newCol]){
            moves.push({row, col: newCol})
          } else{
            if(pieces[row][newCol].color !== piece.color){
              moves.push({row, col: newCol})
            }

            break;
          }
        }

      }
    }

    if(piece.type === "bishop"){

      const directions = [
        { drow: -1, dcol: -1 }, // вверх-влево
        { drow: -1, dcol: 1 },  // вверх-вправо
        { drow: 1, dcol: -1 },  // вниз-влево
        { drow: 1, dcol: 1 }    // вниз-вправо
    ];

      for(const {drow, dcol} of directions){
        for(let i = 1; i < 8; i++) {
            const newRow = row + i * drow;
            const newCol = col + i * dcol;
            
            if(newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            console.log(newRow, newCol)
            if(!pieces[newRow][newCol]) {
                moves.push({row: newRow, col: newCol});
            } else {
                if(pieces[newRow][newCol].color !== piece.color) {
                    moves.push({row: newRow, col: newCol}); 
                }
                break; 
            }
        }
      }
    }

    if(piece.type === "knight"){

      const knightMoves = [
        {drow: -2, dcol: 1}, {drow: -2, dcol: -1},
        {drow: 2, dcol: 1}, {drow: 2, dcol: -1},
        {drow: 1, dcol: 2}, {drow: 1, dcol: -2},
        {drow: -1, dcol: 2}, {drow: -1, dcol: -2}
      ]

      for(const {drow, dcol} of knightMoves){
          const newRow = row +  drow
          const newCol = col + dcol

          if( newRow < 0 || newCol < 0 || newRow >=8 || newCol >=8) continue

          if(!pieces[newRow][newCol]){
            moves.push({row: newRow, col: newCol})
          } else{

            if(pieces[newRow][newCol].color !== piece.color){
              moves.push({row: newRow, col: newCol})
            }
          }

      }
    }
    
    if(piece.type === "queen"){
      const directions = [
        { drow: -1, dcol: -1 }, // вверх-влево
        { drow: -1, dcol: 1 },  // вверх-вправо
        { drow: 1, dcol: -1 },  // вниз-влево
        { drow: 1, dcol: 1 }    // вниз-вправо
    ];

      for(const {drow, dcol} of directions){
        for(let i = 1; i < 8; i++) {
            const newRow = row + i * drow;
            const newCol = col + i * dcol;
            
            if(newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            console.log(newRow, newCol)
            if(!pieces[newRow][newCol]) {
                moves.push({row: newRow, col: newCol});
            } else {
                if(pieces[newRow][newCol].color !== piece.color) {
                    moves.push({row: newRow, col: newCol}); 
                }
                break; 
            }
        }
      }

      for (let dir of [-1, 1]) { //-1 - вниз, 1 - вверх
        for (let i = 1; i<8;i++) {
          const newRow = row+i * dir
          if(newRow<0 || newRow>=8) break

          if(!pieces[newRow][col]){
            moves.push({row: newRow, col})
          } 
          else{

              if(pieces[newRow][col].color !== piece.color){
                moves.push({row: newRow, col})
              }
              break
              
            }
          }
        }
    
      // Движение по горизонтали вправо влево
      for (let dir of [-1, 1]) { //-1 - влево, 1 - вправо
        for( let i = 1; i < 8; i++ ){
          const newCol = col + i * dir

          if(newCol<0 || newCol>=8) break

          if(!pieces[row][newCol]){
            moves.push({row, col: newCol})
          } else{
            if(pieces[row][newCol].color !== piece.color){
              moves.push({row, col: newCol})
            }

            break;
          }
        }

      }
    }

    if (piece.type === "king") {
    const kingMoves = [
        { dr: -1, dc: 0 },  
        { dr: 1, dc: 0 },  
        { dr: 0, dc: -1 },   
        { dr: 0, dc: 1 },    
        { dr: -1, dc: -1 },  
        { dr: -1, dc: 1 },   
        { dr: 1, dc: -1 },  
        { dr: 1, dc: 1 }    
    ];

    for (const { dr, dc } of kingMoves) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
           
            if (!pieces[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
  
}

    setPossibleMoves(moves);
  };

    return (
    <div className="board-container">
      <div className="current-player">Current player: {currentPlayer}</div>
      <div className="board" style={{ transform: currentPlayer === 'black' ? 'rotate(180deg)' : 'none' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row" style={{ 
            transform: currentPlayer === 'black' ? 'rotate(180deg)' : 'none'
          }}>
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                piece={pieces[rowIndex][colIndex]}
                isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
                isPossibleMove={possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                isFlipped={currentPlayer === 'black'}
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

