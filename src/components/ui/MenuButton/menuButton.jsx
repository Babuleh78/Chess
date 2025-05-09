// menuButton.jsx
import React from 'react';
import './menuButton.css';

export default function MenuButton({ text, onClick }) {
  return (
    <div className="menu-button-container">
      <button className="menu-button-3d" onClick={onClick}>
        <span className="menu-button-face">{text}</span>
        <span className="menu-button-face">{text}</span>
        <span className="menu-button-face">{text}</span>
        <span className="menu-button-face">{text}</span>
      </button>
    </div>
  );
}