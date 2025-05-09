import React from "react";
import "./cell.css";
export default function Cell({ cell, onClick, isSelected, isPossibleMove, piece }) {
  let cellClass = `cell ${cell.color}`;
  if (isSelected) {
    cellClass += " selected";
  }
  if (isPossibleMove) {
    cellClass += " possible-move";
  }

  let pieceImage = null
  if(piece){
    const path = `/figureimages${piece.color}-${piece.type}.png`
    console.log(path)
    pieceImage = piece ? path : null
  }

  return (
    <div className={cellClass} onClick={onClick}>
      {piece && (
        <img 
          src = "https://i.pinimg.com/736x/29/2a/d6/292ad63a402cf917cd7f2316065f4e03.jpg"
          alt={`${piece.color}-${piece.type}`}
          className="piece-image"
        />
      )}
    </div>
  );
}