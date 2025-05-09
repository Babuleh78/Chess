import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/layout/MainMenu/mainMenu';
import SoloWindow from './components/layout/SoloWindow/solowindow';

export default function App() {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [theme, setTheme] = useState('light');
  const [showMainMenu, setShowMainMenu] = useState(true);

  const handleSoundToggle = () => {
    setIsSoundOn(!isSoundOn);
  };

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };


  const handleSinglePlayer = () => {
    setShowMainMenu(false); 
  };

  const handleBackToMenu = () => {
    setShowMainMenu(true); 
  };

  
    
  return (
    <div className={`app ${theme}-theme`}>
      {showMainMenu && (
        <MainMenu 
          onSinglePlayer={handleSinglePlayer}
          onSoundToggle={handleSoundToggle}
          onThemeChange={handleThemeChange}
        />
      )}
      
      {!showMainMenu && (
        <SoloWindow onBack={handleBackToMenu} />
      )}
    </div>
  );
   
}
