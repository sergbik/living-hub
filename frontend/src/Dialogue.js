import React, { useState, useEffect } from 'react';
import './Dialogue.css';

function Dialogue() {
  const [qa, setQa] = useState({ question: '', answer: '' });
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    const fetchQa = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/qa');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQa(data);
      } catch (error) {
        console.error("Ошибка при загрузке диалога:", error);
      }
    };

    fetchQa();
    const interval = setInterval(fetchQa, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newMessageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewMessageText('');
      // The file watcher on the backend will handle the rest
    } catch (error) {
      console.error("Ошибка при отправке вопроса:", error);
      alert("Произошла ошибка при отправке вашего вопроса.");
    }
  };

  return (
    <div className="dialogue">
      <h2>Живой Диалог</h2>
      
      <div className="qa-display">
        {qa.question && (
          <div className="question-section">
            <strong>Вопрос:</strong>
            <p>{qa.question}</p>
          </div>
        )}
        {qa.answer && (
          <div className="answer-section">
            <strong>Ответ Евы:</strong>
            <p>{qa.answer}</p>
          </div>
        )}
        {!qa.question && !qa.answer && (
            <p>Диалог пуст. Задайте вопрос, чтобы начать.</p>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="send-message-form">
        <textarea
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Задайте свой вопрос здесь..."
          rows="3"
          disabled={qa.question !== ''} // Disable form if there is an active question
        />
        <button type="submit" disabled={qa.question !== ''}>
          Отправить вопрос
        </button>
      </form>
    </div>
  );
}

export default Dialogue;