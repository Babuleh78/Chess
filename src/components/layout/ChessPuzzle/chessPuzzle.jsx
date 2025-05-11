import React, { useState } from 'react';
import "./chessPuzzle.css";
import Board from '../../ui/Board/board';

export default function ChessPuzzles({ onBack }) {
  // Состояние для хранения текущей выбранной задачи
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  // Состояние для отслеживания решения
  const [isSolved, setIsSolved] = useState(false);

  // Список задач (пока только одна)
  const puzzles = [
    {
      id: 214,
      title: "Шахматная задача №214",
      description: "Черные ставят мат в 1 ход",
      fen: "8/8/8/8/4k3/8/4K3/3r4 b - - 0 1", // FEN-позиция для задачи
      solution: "d1e1" // Правильный ход (ладья d1-e1)
    }
  ];

  // Обработчик выбора задачи
  const handlePuzzleSelect = (puzzle) => {
    setCurrentPuzzle(puzzle);
    setIsSolved(false);
  };

  // Обработчик хода (проверка решения)
  const handleMove = (move) => {
    if (!currentPuzzle) return;
    
    // Проверяем, совпадает ли ход с решением
    if (move === currentPuzzle.solution) {
      setIsSolved(true);
    }
  };

  return (
    <div className="chess-puzzles-container">
      <button className="back-button" onClick={onBack}>← Назад в меню</button>
      
      <div className="puzzles-list">
        {puzzles.map(puzzle => (
          <div 
            key={puzzle.id}
            className={`puzzle-card ${currentPuzzle?.id === puzzle.id ? 'active' : ''}`}
            onClick={() => handlePuzzleSelect(puzzle)}
          >
            <h3>{puzzle.title}</h3>
            <p>{puzzle.description}</p>
          </div>
        ))}
      </div>

      {currentPuzzle && (
        <div className="puzzle-board-container">
          <h2>{currentPuzzle.title}</h2>
          <p>{currentPuzzle.description}</p>
          
          <div className="board-wrapper">
            <Board 
              fen={currentPuzzle.fen} 
              onMove={handleMove}
              isPuzzleMode={true}
              currentPlayer="black" 
            />
          </div>

          {isSolved && (
            <div className="solution-message success">
              Правильно! Задача решена.
            </div>
          )}
        </div>
      )}
    </div>
  );
}