import React, { useState } from 'react';
import "./chessPuzzle.css";
import PuzzleBoard from '../../ui/PuzzleBoard/puzzleBoard';
import puzzles from './puzzleData';
export default function ChessPuzzles({ onBack }) {


  return (
    <>
    <PuzzleBoard
      onBack={onBack}
      puzzles={puzzles}
    />
    </>
  );
}