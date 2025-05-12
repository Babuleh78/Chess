const puzzles = [
  {
    name: "Мат в 1 ход",
    description: "Белые начинают и ставят мат в 1 ход",
    difficulty: 1,
    theme: "Мат ферзем",
    initialPosition: initPuzzlePosition1(),
    solution: [
      {
        white: { from: {row: 6, col: 3}, to: {row: 0, col: 3} }, 
        black: null 
      }
    ]
  },
  {
    name: "Жертва ферзя",
    description: "Порой, следует пожертвовать самой сильной фигурой, чтобы выиграть партию. Поставьте мат в два хода",
    difficulty: 2,
    theme: "Жертва фигур",
    initialPosition: initPuzzlePosition2(),
    solution: [
      {
        white: { from: {row: 2, col: 6}, to: {row: 1, col: 7} }, 
        black: { from: {row: 0, col: 6}, to: {row: 1, col: 7} }  
      },
      {
        white: { from: {row: 3, col: 7}, to: {row: 1, col: 5} }, 
        black: null 
      }
    ]
  },
  {
    name: "Наглость второе счастье",
    description: "Не потеряйтесь в большом количестве фигур! Поставьте мат в два хода",
    difficulty: 3,
    theme: "Виденье доски",
    initialPosition: initPuzzlePosition3(),
    solution: [
      {
        white: { from: {row: 7, col: 2}, to: {row: 1, col: 2} }, 
        black: { from: {row: 0, col: 1}, to: {row: 0, col: 0} }  
      },
      {
        white: { from: {row: 1, col: 2}, to: {row: 0, col: 1} }, 
        black: null 
      }
    ]
  }
];


function initPuzzlePosition1() {
  const position = Array(8).fill(null).map(() => Array(8).fill(null));
  position[6][3] = { type: "queen", color: "white" };
  position[0][4] = { type: "king", color: "black" };
  position[4][7] = { type: "bishop", color: "white"};
  return position;
}

function initPuzzlePosition2() {
  const position = Array(8).fill(null).map(() => Array(8).fill(null));
  position[0][0] = { type: "rook", color: "black" };
  position[0][5] = { type: "rook", color: "black" };
  position[1][0] = { type: "pawn", color: "black" };
  position[1][1] = { type: "pawn", color: "black" };
  position[1][2] = { type: "pawn", color: "black" };
  position[1][6] = { type: "pawn", color: "black" };
  position[0][6] = { type: "king", color: "black" };
  position[2][3] = { type: "pawn", color: "black" };
  position[3][1] = { type: "bishop", color: "black" };
  position[3][5] = { type: "pawn", color: "black" };
  position[7][4] = { type: "queen", color: "black" };




  position[2][6] = { type: "queen", color: "white"};
  position[3][7] = { type: "bishop", color: "white"};
  position[4][7] = { type: "rook", color: "white"};
  position[5][6] = { type: "pawn", color: "white"};
  position[6][7] = { type: "pawn", color: "white"};
  position[6][5] = { type: "pawn", color: "white"};
  position[6][6] = { type: "king", color: "white"};
  position[6][0] = { type: "pawn", color: "white"};
  position[6][1] = { type: "pawn", color: "white"};
  return position;
}


function initPuzzlePosition3() {
  const position = Array(8).fill(null).map(() => Array(8).fill(null));
  position[0][1] = { type: "king", color: "black" };
  position[0][2] = { type: "bishop", color: "black" };
  position[0][3] = { type: "rook", color: "black" };
  position[0][4] = { type: "queen", color: "black" };
  position[0][7] = { type: "rook", color: "black" };
  position[1][0] = { type: "pawn", color: "black" };
  position[1][1] = { type: "pawn", color: "black" };
  position[1][2] = { type: "pawn", color: "black" };
  position[1][4] = { type: "bishop", color: "black" };
  position[1][5] = { type: "pawn", color: "black" };
  position[1][7] = { type: "pawn", color: "black" };
  position[2][1] = { type: "knight", color: "black" };
  position[2][6] = { type: "pawn", color: "black" };
  position[2][5] = { type: "knight", color: "black" };
  position[3][3] = { type: "pawn", color: "black" };

  position[4][3] = { type: "pawn", color: "white"};
  position[5][0] = { type: "pawn", color: "white"};
  position[5][5] = { type: "knight", color: "white"};
  position[5][6] = { type: "bishop", color: "white"};
  position[6][1] = { type: "pawn", color: "white"};
  position[6][4] = { type: "bishop", color: "white"};
  position[6][5] = { type: "pawn", color: "white"};
  position[6][6] = { type: "pawn", color: "white"};
  position[6][7] = { type: "pawn", color: "white"};

  position[7][0] = { type: "rook", color: "white"};
  position[7][5] = { type: "rook", color: "white"};
  position[7][6] = { type: "king", color: "white"};
  position[7][2] = { type: "queen", color: "white"};

  return position;
}







export default puzzles;