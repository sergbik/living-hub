import React, { useState } from 'react';
import './Dialogue.css';

const API_BASE_URL = 'https://living-hub-backend.onrender.com';

function Dialogue() {
  const [qa, setQa] = useState({ question: '', answer: '' });
  const [newMessageText, setNewMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessageText.trim() || isSending) return;

    setIsSending(true);
    setQa({ question: newMessageText, answer: 'Отправка вопроса...' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newMessageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.answer || 'Ошибка на сервере');
      }
      
      // Сразу отображаем вопрос и полученный ответ
      setQa(data);

    } catch (error) {
      console.error("Ошибка при отправке вопроса:", error);
      // Отображаем ошибку в поле ответа
      setQa({ question: newMessageText, answer: `Ошибка: ${error.message}` });
    } finally {
      setIsSending(false);
      setNewMessageText('');
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
      </div>

      <form onSubmit={handleSendMessage} className="send-message-form">
        <textarea
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Задайте свой вопрос здесь..."
          rows="3"
        />
        <button type="submit" disabled={isSending}>
          {isSending ? 'Отправка...' : 'Отправить вопрос'}
        </button>
      </form>
    </div>
  );
}

export default Dialogue;