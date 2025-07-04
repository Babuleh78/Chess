import React, { use, useEffect } from "react";
import { useState } from "react";
import Cell from "../Cell/cell";


export default function BotBoard( {onBack}) {
  const [board] = useState(
    Array(8).fill(null).map((_, row) => 
      Array(8).fill(null).map((_, col) => ({row,col,  color: (row + col) % 2 === 0 ? "white" : "black"}))
    )
  );

  const handleExitToMenu = () => {
    if (window.confirm("Вы уверены, что хотите выйти в меню? Текущая игра будет потеряна.")) {
      onBack();
    }
  };
  
  const [pieces, setPieces] = useState(initFigures()); // Фигуры
  const [selectedCell, setSelectedCell] = useState(null); // Выбранная клетка
  const [possibleMoves, setPossibleMoves] = useState([]); // Возможные ходы
  const [currentPlayer, setCurrentPlayer] = useState("white"); // Текущий игрок
  const [kingInCheck, setKingInCheck] = useState(null); // Есть ли Шах королю
  const [fonActive, setFonActive] = useState(true); // Активен ли анимированный фон

  const [gameOver, setGameOver] = useState(false); // Идет ли игра
  const [gameResult, setGameResult] = useState(null); // Белый черный или ничья
  const [promotingPawn, setPromotingPawn] = useState(null); // Отслеживаем пешку
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] }); // "Убитые" фигуры
  const [materialAdvantage, setMaterialAdvantage] = useState(0); // Подсчет преимущества
  const [gameInit, setGameInit] = useState(true); // Требует ли игра инициализации


  useEffect(() => {
    if(gameInit){
      // Инициализация на сервере
      fetch('http://localhost:8080/api/restart').then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .then(data => {
        console.log('Успешный ответ:', data);
      })
      .catch(error => {
        console.error('Ошибка запроса:', error);
      });
      
      setGameInit(false)
      }
  }, [gameInit])

 useEffect(() => {
  if (currentPlayer === "black") {
    const fetchBotMove = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bot-move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) throw new Error('Ошибка сервера');
        const data = await response.json();
        console.log('Ответ сервера:', data);
        const {fromY, fromX, toY, toX} = data;

        const newPieces = [...pieces.map(row => [...row])];
        const piece = newPieces[fromY][fromX];

        // Обработка взятия фигуры (добавлено)
        if (newPieces[toY][toX]) { 
          const capturedPiece = newPieces[toY][toX];
          setCapturedPieces(prev => {
            const newCaptured = {
              ...prev,
              black: [...prev.black, capturedPiece] // Бот (черные) берет фигуру
            };
            
            // Расчет материального преимущества (добавлено)
            const pieceValues = {
              pawn: 1, knight: 3, bishop: 3, 
              rook: 5, queen: 9, king: 0
            };
            const whiteLost = newCaptured.white.reduce((s, p) => s + pieceValues[p.type], 0);
            const blackLost = newCaptured.black.reduce((s, p) => s + pieceValues[p.type], 0);
            setMaterialAdvantage(-blackLost + whiteLost);
            
            return newCaptured;
          });
        }

        // Обычный ход
        newPieces[toY][toX] = { ...piece, hasMoved: true };
        newPieces[fromY][fromX] = null;

        // Превращение пешки (добавлено)
        if (piece.type === "pawn" && (toY === 0 || toY === 7)) {
          setPromotingPawn({row: toY, col: toX, color: piece.color});
        }

        setPieces(newPieces);
        const opponentColor = "white";
        const kingPos = findKing(opponentColor, newPieces);
        const isCheck = isSquareUnderAttack(kingPos.row, kingPos.col, newPieces, "black");
        
        if (isCheck) {
          setKingInCheck(kingPos);
        } else {
          setKingInCheck(null);
        }

        const isCheckmate = checkForCheckmate(opponentColor, newPieces);
        if (isCheckmate) {
          setGameOver(true);
          setGameResult("black");
        }

        setCurrentPlayer("white");
      } catch (error) {
        console.error('Ошибка при отправке хода:', error);
      }
    };

    fetchBotMove();
  }
}, [currentPlayer, pieces]); // Добавлен pieces в зависимости
  
  
const handleResign = () => {
  if (gameOver) return;
  setGameOver(true);
  setGameResult(currentPlayer === 'white' ? 'black' : 'white');
 
};

 


  const handleCellClick = async (row, col) => {
    if(currentPlayer === "black"){ return }
    if (selectedCell && selectedCell.row === row && selectedCell.col === col ) {
    
      setSelectedCell(null);
      setPossibleMoves([]);
      return;
    }

    if (selectedCell && possibleMoves.some(move => move.row === row && move.col === col)) {
      const newPieces = [...pieces.map(row => [...row])];
      const piece = newPieces[selectedCell.row][selectedCell.col];
      const move = possibleMoves.find(m => m.row === row && m.col === col);

      if (newPieces[row][col]) { 
        
        const capturedPiece = newPieces[row][col];
        setCapturedPieces(prev => {
            const newCaptured = {
                ...prev,
                [currentPlayer]: [...prev[currentPlayer], capturedPiece]
            };
            // Сразу рассчитываем на основе newCaptured
            const pieceValues = {
                pawn: 1, knight: 3, bishop: 3, 
                rook: 5, queen: 9, king: 0
            };
            const whiteLost = newCaptured.white.reduce((s, p) => s + pieceValues[p.type], 0);
            const blackLost = newCaptured.black.reduce((s, p) => s + pieceValues[p.type], 0);
            setMaterialAdvantage(-blackLost + whiteLost);
            return newCaptured;
        });
    }

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
      }

      setPieces(newPieces);
      setSelectedCell(null);
      setPossibleMoves([]);



      if(currentPlayer === "white"){
        const convertToChessNotation = (row, col) => {
          const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          return `${letters[col]}${8 - row}`;
        };

        const from = convertToChessNotation(selectedCell.row, selectedCell.col); 
        const to = convertToChessNotation(row, col); 
        console.log(from, to)

        try{
          const response = await fetch('http://localhost:8080/api/player-move',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to }), 
          });
           if (!response.ok) throw new Error('Ошибка сервера');
        
        } catch (error){
          console.error('Ошибка при отправке хода:', error);

      }
      setCurrentPlayer(opponentColor);
      return;
    }
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
    return false; 
  }

  // Проверяем, есть ли хотя бы один допустимый ход для любой фигуры этого цвета
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = pieces[r][c];
      if (piece && piece.color === color) {
        const moves = getPossibleMovesForPiece(r, c, piece, pieces);
        console.log(moves)
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
      // if (pieces[row][0] && pieces[row][0].type === "rook" && !pieces[row][0].hasMoved) {
      //   // Проверяем, что клетки между королем и ладьей свободны
      //   if (!pieces[row][1] && !pieces[row][2] && !pieces[row][3]) {
      //     // Проверяем, что король не под шахом и не проходит через атакованные клетки
      //     if (!isSquareUnderAttack(row, col, pieces, piece.color === "white" ? "black" : "white") &&
      //         !isSquareUnderAttack(row, 2, pieces, piece.color === "white" ? "black" : "white") &&
      //         !isSquareUnderAttack(row, 3, pieces, piece.color === "white" ? "black" : "white")) {
      //       moves.push({ row: row, col: 2, isCastling: true, rookCol: 0, newRookCol: 3 });
      //     }
      //   }
      //}
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
  
  Error.log("Король не найден!")
}




function calculatePossibleMoves(row, col, piece) {
    const moves = getPossibleMovesForPiece(row, col, piece, pieces);
    
    console.log(moves)
    const safeMoves = moves.filter(move => {
        return isMoveSafeForKing(row, col, move.row, move.col, pieces, piece.color);
    });
    
    setPossibleMoves(safeMoves);
  };

    
return (
  <>
  <div className={fonActive ? "board-background active" : "board-background"}></div>
  <div className="board-container">
    <div className="left-panel">
    

      <div className="controls">
      

        <button 
          onClick={() => setFonActive(!fonActive)}
          className="rotate-button"
        >
          <b>{fonActive ? "Отключить фон" : "Включить Фон"}</b>
        </button>

        {!gameOver && (
          <button 
            onClick={handleResign}
            className="resign-button"
          >
            <b>Сдаться</b>
          </button>
        )}
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
         
          setKingInCheck(null);
            }}
            className="new-game-button"
          >
            Новая игра
          </button>

          
        </div>
      </div>
    )}

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
              isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
              isPossibleMove={possibleMoves.some(move => move.row === rowIndex && move.col === colIndex)}
              isInCheck={kingInCheck && kingInCheck.row === rowIndex && kingInCheck.col === colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
           
            />
          ))}
          
        </div>
        
      ))}
    </div>
    
      <div className="right-panel">
      <div className="captured-pieces">
        <h3>Съеденные фигуры</h3>
        <div className="pieces-list white-captured">
          <h4>Белые взяли:</h4>
          {capturedPieces.white.map((piece, index) => (
            <div key={index} className={`captured-piece `}>
              <Cell 
                cell={{color: 'white'}} 
                piece={piece} 
                small={true}
              />
            </div>
          ))}
        </div>
        

      

        <div className="pieces-list black-captured">
          <h4>Чёрные взяли:</h4>
          {capturedPieces.black.map((piece, index) => (
            <div key={index} className={`captured-piece `}>
              <Cell 
                cell={{color: 'black'}} 
                piece={piece} 
                small={true}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="material-advantage">
        <h3>Материальное преимущество</h3>
        <div className={`advantage ${materialAdvantage > 0 ? 'white' : materialAdvantage < 0 ? 'black' : 'equal'}`}>
          {materialAdvantage > 0 
            ? `+${materialAdvantage} (Белые)` 
            : materialAdvantage < 0 
              ? `${Math.abs(materialAdvantage)} (Чёрные)` 
              : 'Равно'}
        </div>
      </div>
    </div>



    
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
                    
                    
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        <div className="menu-exit-container">
          <button 
            className="exit-to-menu-button"
            onClick={handleExitToMenu}
          >
            <span className="icon">←</span> Выход в меню
          </button>
        </div>

    </div>
</>

        
  );
}



function initFigures() {
  // Инициализация на доске
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