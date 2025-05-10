import React, { useEffect } from "react";
import { useState } from "react";
import Cell from "../Cell/cell";
import "./board.css";

export default function Board() {
  const [board] = useState(
    Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({row,col,  color: (row + col) % 2 === 0 ? "white" : "black"}))
    )
  );

  
  const [pieces, setPieces] = useState(initFigures()); // Фигуры
  const [selectedCell, setSelectedCell] = useState(null); // Выбранная клетка
  const [possibleMoves, setPossibleMoves] = useState([]); // Возможные ходы
  const [currentPlayer, setCurrentPlayer] = useState("white"); // Текущий игрок
  const [kingInCheck, setKingInCheck] = useState(null); // Есть ли Шах королю
  const [rotateBoard, setRotateBoard] = useState(true); // Нужно ли поворачивать доску

  const [whiteTime, setWhiteTime] = useState(600); // Время для белых
  const [blackTime, setBlackTime] = useState(600); // Время для черных
  const [timerActive, setTimerActive] = useState(true); // Активен ли таймер
  const [gameOver, setGameOver] = useState(false); // Идет ли игра
  const [gameResult, setGameResult] = useState(null); // Белый черный или ничья
  const [promotingPawn, setPromotingPawn] = useState(null); // Отслеживаем пешку

const handleResign = () => {
  if (gameOver) return;
  setGameOver(true);
  setGameResult(currentPlayer === 'white' ? 'black' : 'white');
  setTimerActive(false);
};

  useEffect(() => {
  let interval;
  if (timerActive && !gameOver) {
    interval = setInterval(() => {
      currentPlayer === 'white' 
        ? setWhiteTime(prev => prev > 0 ? prev - 1 : 0)
        : setBlackTime(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
  }
  
  if (whiteTime === 0) {
    setGameOver(true);
    setGameResult('black');
    setTimerActive(false);
  } else if (blackTime === 0) {
    setGameOver(true);
    setGameResult('white');
    setTimerActive(false);
  }

    return () => clearInterval(interval);
  }, [currentPlayer, timerActive, gameOver, whiteTime, blackTime]);

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCellClick = (row, col) => {
  if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
    setSelectedCell(null);
    setPossibleMoves([]);
    return;
  }

  if (selectedCell && possibleMoves.some(move => move.row === row && move.col === col)) {
    const newPieces = [...pieces.map(row => [...row])];
    const piece = newPieces[selectedCell.row][selectedCell.col];
    const move = possibleMoves.find(m => m.row === row && m.col === col);

    // Обработка рокировки
    if (move && move.isCastling) {
      // Перемещаем короля
      newPieces[row][col] = { ...piece, hasMoved: true };
      newPieces[selectedCell.row][selectedCell.col] = null;
      
      // Перемещаем ладью
      const rook = newPieces[row][move.rookCol];
      newPieces[row][move.newRookCol] = { ...rook, hasMoved: true };
      newPieces[row][move.rookCol] = null;
    } 
    // Обычный ход
    else {
      newPieces[row][col] = { ...piece, hasMoved: true };
      newPieces[selectedCell.row][selectedCell.col] = null;
      
      // Проверка на достижение пешкой последней горизонтали
      if (piece.type === "pawn" && (row === 0 || row === 7)) {
        setPromotingPawn({row, col, color: piece.color});
        setPieces(newPieces);
        setSelectedCell(null);
        setPossibleMoves([]);
        return;
      }
    }

    const opponentColor = currentPlayer === "white" ? "black" : "white";
    const kingPos = findKing(opponentColor, newPieces);
    const isCheck = isSquareUnderAttack(kingPos.row, kingPos.col, newPieces, currentPlayer);
    
    if (isCheck) {
      setKingInCheck(isCheck ? kingPos : null);
    } else {
      setKingInCheck(null);
    }
    
    const isCheckmate = checkForCheckmate(opponentColor, newPieces);
    if (isCheckmate) {
      setGameOver(true);
      setGameResult(currentPlayer);
      setTimerActive(false);
    }

    setPieces(newPieces);
    setSelectedCell(null);
    setPossibleMoves([]);
    setCurrentPlayer(opponentColor);
    return;
  }

  const piece = pieces[row][col];
  if (piece && piece.color === currentPlayer) {
    setSelectedCell({ row, col });
    calculatePossibleMoves(row, col, piece);
  }
};

const handlePromotionChoice = (pieceType) => {
  if (!promotingPawn) return;

  const newPieces = [...pieces.map(row => [...row])];
  newPieces[promotingPawn.row][promotingPawn.col] = {
    type: pieceType,
    color: promotingPawn.color,
    hasMoved: true
  };

  setPieces(newPieces);
  setPromotingPawn(null);
  
  // Проверка на мат после превращения
  const opponentColor = currentPlayer === "white" ? "black" : "white";
  const kingPos = findKing(opponentColor, newPieces);
  const isCheck = isSquareUnderAttack(kingPos.row, kingPos.col, newPieces, currentPlayer);
  
  if (isCheck) {
    setKingInCheck(isCheck ? kingPos : null);
    const isCheckmate = checkForCheckmate(opponentColor, newPieces);
    if (isCheckmate) {
      setGameOver(true);
      setGameResult(currentPlayer);
      setTimerActive(false);
    }
  } else {
    setKingInCheck(null);
  }
  
  setCurrentPlayer(opponentColor);
};

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

function checkForCheckmate(color, pieces) {
  const kingPos = findKing(color, pieces);
  if (!isSquareUnderAttack(kingPos.row, kingPos.col, pieces, color === 'white' ? 'black' : 'white')) {
    return false; // Нет шаха - нет мата
  }

  // Проверяем, есть ли хотя бы один допустимый ход для любой фигуры этого цвета
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = pieces[r][c];
      if (piece && piece.color === color) {
        const moves = getPossibleMovesForPiece(r, c, piece, pieces);
        for (const move of moves) {
          if (isMoveSafeForKing(r, c, move.row, move.col, pieces, color)) {
            return false; // Нашли допустимый ход - мата нет
          }
        }
      }
    }
  }
  
  return true; // Нет допустимых ходов - это мат
}

function isMoveSafeForKing (fromRow, fromCol, toRow, toCol, pieces, currentColor){

  const tempPieces = pieces.map(row => [...row]);

  tempPieces[toRow][toCol] = tempPieces[fromRow][fromCol];
  tempPieces[fromRow][fromCol] = null;
  
  const kingPos = findKing(currentColor, tempPieces);
  return !isSquareUnderAttack(kingPos.row, kingPos.col, tempPieces, currentColor === "white" ? "black" : "white");
};

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

function findKing(color, pieces) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = pieces[r][c]
      if (piece && piece.type === "king" && piece.color === color) {
        return { row: r, col: c }
      }
    }
  }
  throw new Error("Король не найден!")
}




function calculatePossibleMoves(row, col, piece) {
    const moves = getPossibleMovesForPiece(row, col, piece, pieces);

    const safeMoves = moves.filter(move => {
        return isMoveSafeForKing(row, col, move.row, move.col, pieces, piece.color);
    });
    
    setPossibleMoves(safeMoves);
  };

    
    return (
  <div className="board-container">
    <div className="timers">
        <div className={`timer ${currentPlayer === 'black' ? 'active' : ''} ${whiteTime === 0 ? 'timeout' : ''}`}>
          <div className="player-name">Белые</div>
          <div className="time">{formatTime(whiteTime)}</div>
        </div>
        <div className={`timer ${currentPlayer === 'white' ? 'active' : ''} ${blackTime === 0 ? 'timeout' : ''}`}>
          <div className="player-name">Чёрные</div>
          <div className="time">{formatTime(blackTime)}</div>
        </div>
      </div>
      {gameOver && (
  <div className="game-over-modal">
    <div className="game-over-content">
      <h2>Игра окончена!</h2>
      <p>
        {gameResult === 'white' && 'Белые победили!'}
        {gameResult === 'black' && 'Чёрные победили!'}
        {gameResult === 'draw' && 'Ничья!'}
      </p>
      <button 
        onClick={() => {
          setPieces(initFigures());
          setGameOver(false);
          setGameResult(null);
          setCurrentPlayer('white');
          setWhiteTime(600);
          setBlackTime(600);
          setTimerActive(true);
          setKingInCheck(null);
            }}
            className="new-game-button"
          >
            Новая игра
          </button>
        </div>
      </div>
    )}




    <div className="board" style={{ transform: rotateBoard && currentPlayer === 'black' ? 'rotate(180deg)' : 'none' }}>
      {board.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="board-row" 
          style={{ 
            transform: rotateBoard && currentPlayer === 'black' ? 'rotate(180deg)' : 'none'
          }}
        >
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              piece={pieces[rowIndex][colIndex]}
              isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
              isPossibleMove={possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)}
              isInCheck={kingInCheck && kingInCheck.row === rowIndex && kingInCheck.col === colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              isFlipped={rotateBoard && currentPlayer === 'black'}
            />
          ))}
          
        </div>
        
      ))}
    </div>
    
      <div className="controls">
        <button 
          onClick={() => setRotateBoard(!rotateBoard)}
          className="rotate-button"
        >
          <b>{rotateBoard ? "Отключить поворот" : "Включить поворот"}</b>
        </button>
        {!gameOver && (
          <button 
            onClick={handleResign}
            className="resign-button"
          >
            <b>Сдаться</b>
          </button>
        )}
        {promotingPawn && (
          <div className="promotion-modal">
            <div className="promotion-content">
              <h2>Выберите фигуру для превращения</h2>
              <div className="promotion-options">
                {['queen', 'rook', 'bishop', 'knight'].map(pieceType => (
                  <div 
                    key={pieceType}
                    className="promotion-option"
                    onClick={() => handlePromotionChoice(pieceType)}
                  >
                    <Cell
                      cell={{color: promotingPawn.color === 'white' ? 'white' : 'black'}}
                      piece={{type: pieceType, color: promotingPawn.color}}
                      isFlipped={rotateBoard && currentPlayer === 'black'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
  );
}



function initFigures() {
  const cells = Array(8).fill(null).map(()=> Array(8).fill(null));

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
