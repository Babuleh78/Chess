import React from 'react';
import "./mainMenu.css"
import MenuButton from '../../ui/MenuButton/menuButton';
export default function MainMenu({onSinglePlayer, onSoundToggle, onThemeChange}){

 
    
    return (
    <div className="menu-container">
        <div className='main-menu'>
            <div className="main-buttons">
                <MenuButton text="На одном компьютере" 
                onClick={onSinglePlayer}
                 />
                <MenuButton text="Шахматные задачи" onClick={() => console.log('Chess puzzles')} />
                <MenuButton text="Мультиплеер" onClick={() => console.log('Multiplayer')} />
            </div>
    
            <div className="footer-buttons">
                <button className="icon-button" onClick={onSoundToggle}>
                <i className="sound-icon">🔊</i>
                </button>
                <button className="icon-button" onClick={onThemeChange}>
                <i className="theme-icon">🎨</i>
                </button>
                <a 
                href="https://github.com/Babuleh78" 
                target="_blank" 
                rel="noopener noreferrer"
                className="icon-button"
                >
                <i className="github-icon">🐙</i>
                </a>
            </div>
        </div>
    </div>
    )
}

