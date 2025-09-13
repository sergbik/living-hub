import React from 'react';
import './App.css'; // Импортируем стили
import Chronicle from './Chronicle';
import WaveVisualizer from './WaveVisualizer';
import Dialogue from './Dialogue'; // Импортируем новый компонент

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Живой Хаб v1.0</h1>
      </header>
      <main>
        <Chronicle />
        <WaveVisualizer />
        <Dialogue /> {/* Добавляем новый компонент */}
      </main>
    </div>
  );
}

export default App;