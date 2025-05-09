import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/layout/MainMenu/mainMenu';
function App() {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSoundToggle = () => {
    setIsSoundOn(!isSoundOn);
  };

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}-theme`}>
      <MainMenu 
        onSoundToggle={handleSoundToggle}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
   
}

export default App;