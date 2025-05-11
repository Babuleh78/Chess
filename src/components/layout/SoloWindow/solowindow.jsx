
import Board from '../../ui/Board/board';
import './solowindow.css';

export default function SoloWindow({ onBack }) {
  

  return (
    <div className="solo-window">
      <Board 
        onBack={onBack} 
      />
     
    </div>
  );
}