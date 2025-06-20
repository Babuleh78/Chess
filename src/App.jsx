import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/layout/MainMenu/mainMenu';
import SoloWindow from './components/layout/SoloWindow/solowindow';
import ChessPuzzles from './components/layout/ChessPuzzle/chessPuzzle';
import Debut from './components/layout/Debut/debut';
import BotBoard from './components/ui/BotBoard/botboard';
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

  const handleVsBot = () => {
    setCurrentView('bot');
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
          onBot={handleVsBot}
        />
      )}
      
      {currentView === 'game' && (
        <SoloWindow onBack={handleBackToMenu} />
      )}
      
      {currentView === 'puzzles' && (
        <ChessPuzzles onBack={handleBackToMenu} />
      )}
      
      {currentView === 'openings' && (
        <Debut onBack={handleBackToMenu}/>
      )}

      {currentView === 'bot' && (
        <BotBoard onBack = {handleBackToMenu}/>
      )}
    </div>
  );
}