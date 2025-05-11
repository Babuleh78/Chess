import React from 'react';
import "./mainMenu.css";
import MenuButton from '../../ui/MenuButton/menuButton';

export default function MainMenu({ onSinglePlayer, onChessPuzzles, onOpenings }) {
  return (
    <div className="menu-container">
      <div className='main-menu'>
        <div className="main-buttons">
          <MenuButton 
            text="Играть" 
            onClick={onSinglePlayer}
            primary
          />
          <MenuButton 
            text="Шахматные задачи" 
            onClick={onChessPuzzles}
          />
          <MenuButton 
            text="Дебюты" 
            onClick={onOpenings}
          />
        </div>
      </div>
    </div>
  );
}