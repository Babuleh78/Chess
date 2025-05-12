import React from 'react';
import "./mainMenu.css";
import MenuButton from '../../ui/MenuButton/menuButton';

const FloatingPieces = () => {
  const pieces = [
    { img: "/figures/black-king.png", size: '160px', top: '10%', left: '5%', animation: 'float 8s ease-in-out infinite' },
    { img: "/figures/white-king.png", size: '150px', top: '3%', left: '90%', animation: 'float 8s ease-in-out infinite' },
    { img: "figures/black-queen.png", size: '160px', top: '25%', left: '80%', animation: 'float 7s ease-in-out infinite 1s' },
    { img: "figures/white-queen.png", size: '160px', top: '75%', left: '30%', animation: 'float 7s ease-in-out infinite 1s' },
    { img: "/figures/white-bishop.png", size: '150px', top: '60%', left: '10%', animation: 'float 9s ease-in-out infinite 0.5s' },
    { img: "/figures/black-bishop.png", size: '145px', top: '40%', left: '65%', animation: 'float 6s ease-in-out infinite' },
    { img: "/figures/white-knight.png", size: '155px', top: '60%', left: '85%', animation: 'float 8s ease-in-out infinite 2s' },
    { img: "/figures/black-knight.png", size: '155px', top: '30%', left: '25%', animation: 'float 6s ease-in-out infinite 0.7s' },
    { img: "/figures/white-rook.png", size: '145px', top: '3%', left: '45%', animation: 'float 8s ease-in-out infinite 2s' },
    { img: "/figures/black-rook.png", size: '145px', top: '80%', left: '65%', animation: 'float 6s ease-in-out infinite 0.7s' }
  ];

  return (
    <div className="floating-pieces">
      {pieces.map((piece, index) => (
        <img
          key={index}
          src={piece.img}
          alt=""
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            top: piece.top,
            left: piece.left,
            animation: piece.animation,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
            zIndex: 0
          }}
        />
      ))}
    </div>
  );
};

export default function MainMenu({ onSinglePlayer, onChessPuzzles, onOpenings }) {
  return (
    <div className="menu-container">
      <FloatingPieces />
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