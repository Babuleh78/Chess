import React, { useState, useEffect } from "react";
import Cell from "../Cell/cell";
import "./puzzleBoard.css";

export default function PuzzleBoard({ puzzles, onBack }) {
  const [board] = useState(
      Array(8).fill(null).map((_, row) => 
        Array(8).fill(null).map((_, col) => ({row, col, color: (row + col) % 2 === 0 ? "white" : "black"}))
      )
    );

  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
   const [isDone, setIsDone] = useState(() => loadPuzzlesStatus(puzzles.length));


  function updatePuzzleStatus(index, status) {
    setIsDone(prevIsDone => {
      const newIsDone = [...prevIsDone];
      newIsDone[index] = status;
      savePuzzlesStatus(newIsDone); 
      return newIsDone;
    });
  }


  const currentPuzzle = puzzles[currentPuzzleIndex];
  const currentMove = currentPuzzle.solution[currentMoveIndex];

  // Инициализация позиции
  useEffect(() => {
    setPieces(JSON.parse(JSON.stringify(currentPuzzle.initialPosition)));
    setCurrentMoveIndex(0);
    setSelectedCell(null);
    setPossibleMoves([]);
    setHintUsed(false);
    setIsCorrect(null);
    setShowSolution(false);
  }, [currentPuzzleIndex, currentPuzzle]);

  const handleCellClick = (row, col) => {
    if (showSolution) return;
    
    const piece = pieces[row][col];
    
    if (piece && piece.color === "white") {
      setSelectedCell({ row, col });
      const moves = getPossibleMovesForPiece(row, col, piece, pieces);
     
      setPossibleMoves(moves);
      return;
    }

    if (selectedCell && possibleMoves.some(m => m.row === row && m.col === col)) {
      const newPieces = JSON.parse(JSON.stringify(pieces));
      const piece = newPieces[selectedCell.row][selectedCell.col];
      
      newPieces[row][col] = { ...piece, hasMoved: true };
      newPieces[selectedCell.row][selectedCell.col] = null;

      setPieces(newPieces);
      setSelectedCell(null);
      setPossibleMoves([]);

      const correctMove = currentMove.white;
      if (selectedCell.row === correctMove.from.row &&  selectedCell.col === correctMove.from.col && 
          row === correctMove.to.row && col === correctMove.to.col) {
            console.log(newPieces)
        setIsCorrect(true);
        
        if (currentMove.black) {
          setTimeout(() => makeComputerMove(newPieces), 1000);
        } else {
          if (currentMoveIndex === currentPuzzle.solution.length - 1) {
            updatePuzzleStatus(currentPuzzleIndex, true);
          } else {
            setCurrentMoveIndex(currentMoveIndex + 1);
          }
        }
      } else {
        setIsCorrect(false);
        setTimeout(() => {
          setPieces(JSON.parse(JSON.stringify(currentPuzzle.initialPosition)));
          setCurrentMoveIndex(0);
          setIsCorrect(null);
        }, 1000);
      }
    }
  };

function makeComputerMove(currentPieces) {
 
  const newPieces = currentPieces;
  const move = currentMove.black;

  
  newPieces[move.to.row][move.to.col] = newPieces[move.from.row][move.from.col];
  newPieces[move.from.row][move.from.col] = null;
    setTimeout(() => {
    setPieces(newPieces);
    
    if (currentMoveIndex === currentPuzzle.solution.length - 1) {
      setTimeout(() => {
        alert("Задача решена правильно!");
        nextPuzzle();
      }, 500);
    } else {
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  }, 200); 
}

  function isSquareUnderAttack(row, col, pieces, attackingColor) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = pieces[r][c];
      if (piece && piece.color === attackingColor) {
        const moves = getPossibleMovesForPiece(r, c, piece, pieces);
        if (moves.some(move => move.row === row && move.col === col)) {
          return true;
        }
      }
    }
  }
  return false;
}

function getPossibleMovesForPiece(row, col, piece, pieces) {
  const moves = [];
    if (piece.type === "pawn") {
        const direction = piece.color === "white" ? -1 : 1;
        const startRow = piece.color === "white" ? 6 : 1;
        
        if (row + direction >= 0 && row + direction < 8 && !pieces[row + direction][col]) {
          moves.push({ row: row + direction, col });
          
          if (row === startRow && !pieces[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
          }
        }
        
        // Взятие фигур по диагонали
        for (const dc of [-1, 1]) {
          const newCol = col + dc;
          if (newCol >= 0 && newCol < 8) {
            const newRow = row + direction;
            if (newRow >= 0 && newRow < 8) {
              const targetPiece = pieces[newRow][newCol];
              if (targetPiece && targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol });
              }
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
      if (!pieces[newRow][newCol] || pieces[newRow][newCol].color !== piece.color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  // Добавляем проверку на рокировку, если король еще не двигался
  if (!piece.hasMoved) {
      // Короткая рокировка (вправо)
      if (pieces[row][7] && pieces[row][7].type === "rook" && !pieces[row][7].hasMoved) {
        // Проверяем, что клетки между королем и ладьей свободны
        if (!pieces[row][5] && !pieces[row][6]) {
          // Проверяем, что король не под шахом и не проходит через атакованные клетки
          if (!isSquareUnderAttack(row, col, pieces, piece.color === "white" ? "black" : "white") &&
              !isSquareUnderAttack(row, 5, pieces, piece.color === "white" ? "black" : "white") &&
              !isSquareUnderAttack(row, 6, pieces, piece.color === "white" ? "black" : "white")) {
            moves.push({ row: row, col: 6, isCastling: true, rookCol: 7, newRookCol: 5 });
          }
        }
      }
      
      // Длинная рокировка (влево)
      if (pieces[row][0] && pieces[row][0].type === "rook" && !pieces[row][0].hasMoved) {
        // Проверяем, что клетки между королем и ладьей свободны
        if (!pieces[row][1] && !pieces[row][2] && !pieces[row][3]) {
          // Проверяем, что король не под шахом и не проходит через атакованные клетки
          if (!isSquareUnderAttack(row, col, pieces, piece.color === "white" ? "black" : "white") &&
              !isSquareUnderAttack(row, 2, pieces, piece.color === "white" ? "black" : "white") &&
              !isSquareUnderAttack(row, 3, pieces, piece.color === "white" ? "black" : "white")) {
            moves.push({ row: row, col: 2, isCastling: true, rookCol: 0, newRookCol: 3 });
          }
        }
      }
    }
  }

   
  
  return moves;
}


  const nextPuzzle = () => {
    setCurrentPuzzleIndex((currentPuzzleIndex + 1) % puzzles.length);
  };

  const prevPuzzle = () => {
    setCurrentPuzzleIndex((currentPuzzleIndex - 1 + puzzles.length) % puzzles.length);
  };

  const useHint = () => {
    setHintUsed(true);
    const correctMove = currentMove.white;
    setSelectedCell(correctMove.from);
    setPossibleMoves([correctMove.to]);
  };

  const showFullSolution = () => {
    setShowSolution(true);
  };

  const handleExitToMenu = () => {
    if (window.confirm("Вы уверены, что хотите выйти в меню?")) {
      onBack();
    }
  };



  function savePuzzlesStatus(solvedStatus) {
    localStorage.setItem('chessPuzzlesSolved', JSON.stringify(solvedStatus));
  };

  function loadPuzzlesStatus (puzzleCount)  {
    const saved = localStorage.getItem('chessPuzzlesSolved');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length === puzzleCount ? parsed : Array(puzzleCount).fill(false);
    }
    return Array(puzzleCount).fill(false);
  };

  return (
    <>
      <div className="board-background"></div>
      
      <div className="board-container">
        <div className="puzzle-info">
          <h2>{currentPuzzle.name + (isDone[currentPuzzleIndex] ? " Решена!" : "")} </h2>
          <p>{currentPuzzle.description}</p>
          <div className="puzzle-navigation">
            <button onClick={prevPuzzle} className="nav-button">
              ← Предыдущая задача
            </button>
            <button onClick={nextPuzzle} className="nav-button">
              Следующая задача →
            </button>
          </div>
          
          <div className="puzzle-controls">
            <button 
              onClick={useHint} 
              disabled={hintUsed}
              className="hint-button"
            >
              Подсказка
            </button>
            <button 
              onClick={showFullSolution}
              className="solution-button"
            >
              Показать решение
            </button>
          </div>
          
          {isCorrect !== null && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? 'Правильно!' : 'Неверно, попробуйте снова!'}
            </div>
          )}
        </div>

        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  piece={pieces[rowIndex]?.[colIndex]}
                  isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                  isPossibleMove={possibleMoves.some(m => m.row === rowIndex && m.col === colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="puzzle-meta">
          <div className="difficulty">
            Сложность: {currentPuzzle.difficulty}/5
          </div>
          <div className="theme">
            Тема: {currentPuzzle.theme}
          </div>
          <div className="progress">
            Задача {currentPuzzleIndex + 1} из {puzzles.length}
          </div>
          
          <button 
            onClick={handleExitToMenu}
            className="exit-button"
          >
            Выход в меню
          </button>
        </div>
      </div>

      {showSolution && (
        <div className="solution-modal">
          <div className="solution-content">
            <h2>Решение задачи</h2>
            <ol>
              {currentPuzzle.solution.map((move, idx) => (
                <li key={idx}>
                  {move.white.from.col}-{move.white.from.row} → {move.white.to.col}-{move.white.to.row}
                  {move.black && `, затем ${move.black.from.col}-${move.black.from.row} → ${move.black.to.col}-${move.black.to.row}`}
                </li>
              ))}
            </ol>
            <button 
              onClick={() => setShowSolution(false)}
              className="close-button"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}