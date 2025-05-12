const openingsData = [
  {
    name: "Итальянская партия",
    moves: [
      { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } }, // e4
      { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } }, // e5
      { from: { row: 7, col: 6 }, to: { row: 5, col: 5 } }, // Nf3
      { from: { row: 0, col: 1 }, to: { row: 2, col: 2 } }, // Nc6
      { from: { row: 7, col: 5 }, to: { row: 4, col: 2 } }  // Bc4
    ],
    description: "Один из старейших и самых популярных дебютов, характеризующийся активным развитием фигур."
  },
  {
    name: "Защита Каро-Канн",
    moves: [
      { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } }, // e4
      { from: { row: 1, col: 2 }, to: { row: 3, col: 2 } }, // c6
      { from: { row: 6, col: 3 }, to: { row: 4, col: 3 } }, // d4
      { from: { row: 1, col: 3 }, to: { row: 2, col: 3 } }  // d5
    ],
    description: "Солидная защита против e4, где чёрные готовят d5, избегая острых вариантов."
  },
  {
    name: "Французская защита",
    moves: [
      { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } }, // e4
      { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } }, // e6
      { from: { row: 6, col: 3 }, to: { row: 4, col: 3 } }, // d4
      { from: { row: 1, col: 2 }, to: { row: 2, col: 2 } }  // d5
    ],
    description: "Защита с упором на пешечную структуру, часто приводящая к закрытым позициям."
  },

  {
    name: "Английское начало",
    moves: [
      { from: { row: 6, col: 2 }, to: { row: 4, col: 2 } }, // c4
      { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } }, // e5
      { from: { row: 7, col: 1 }, to: { row: 5, col: 2 } }, // Nc3
      { from: { row: 0, col: 1 }, to: { row: 2, col: 2 } }  // Nc6
    ],
    description: "Гибкое начало, которое может трансформироваться в различные пешечные структуры."
  }
];

export default openingsData;