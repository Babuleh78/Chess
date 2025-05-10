import React from "react";
import "./cell.css";

export default function Cell({ cell, onClick, isSelected, isPossibleMove, isInCheck, piece }) {
  
  let cellClass = `cell ${cell.color}`;
  if (isSelected) cellClass += " selected";
  if (isPossibleMove) cellClass += ` possible-move-${cell.color}`;
  if (isInCheck) cellClass += " sell-in-check"
  return (
    <div className={cellClass} onClick={onClick}>
      {piece && (
        <img 
          src={`/figures/${piece.color}-${piece.type}.png`} 
          alt={`${piece.color} ${piece.type}`}
          className="piece-image"
          onError={(e) => {
            e.target.style.display = 'none';
            console.error(`Failed to load image: /figures/${piece.color}-${piece.type}.png`);
          }}
        />
      )}
    </div>
  );
}