import React from 'react';
import chronicleData from './chronicleData.json'; // Импортируем данные из JSON

function Chronicle() {
  return (
    <div className="chronicle">
      <h2>Интерактивная Хроника</h2>
      <div>
        {chronicleData.map(entry => (
          <div key={entry.id} style={{ marginBottom: '20px', borderLeft: '2px solid #00796B', paddingLeft: '15px' }}>
            <h3>{entry.title}</h3>
            <small style={{ color: '#888' }}>{entry.date}</small>
            <p>{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chronicle;