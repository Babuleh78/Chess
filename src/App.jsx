import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/layout/MainMenu/mainMenu';
import SoloWindow from './components/layout/SoloWindow/solowindow';
import ChessPuzzles from './components/layout/ChessPuzzle/chessPuzzle';

export default function App() {
  const [currentView, setCurrentView] = useState('mainMenu'); 

  const handleSinglePlayer = () => {
    setCurrentView('game');
  };

  const handleChessPuzzles = () => {
    setCurrentView('puzzles');
  };

  const handleOpenings = () => {
    setCurrentView('openings');
  };

  const handleBackToMenu = () => {
    setCurrentView('mainMenu');
  };

  return (
    <div>
      {currentView === 'mainMenu' && (
        <MainMenu 
          onSinglePlayer={handleSinglePlayer}
          onChessPuzzles={handleChessPuzzles}
          onOpenings={handleOpenings}
        />
      )}
      
      {currentView === 'game' && (
        <SoloWindow onBack={handleBackToMenu} />
      )}
      
      {currentView === 'puzzles' && (
        <ChessPuzzles onBack={handleBackToMenu} />
      )}
      
      {currentView === 'openings' && (
        <div>Компонент дебютов (заглушка)</div>
      )}
    </div>
  );
}