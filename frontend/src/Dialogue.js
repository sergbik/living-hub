import React, { useState, useEffect } from 'react';
import './Dialogue.css';

// Определяем базовый URL нашего опубликованного бэкенда
const API_BASE_URL = 'https://living-hub-backend.onrender.com';

function Dialogue() {
  const [qa, setQa] = useState({ question: '', answer: '' });
  const [newMessageText, setNewMessageText] = useState('');

  // Эта функция будет получать вопрос и ответ с сервера
  const fetchQa = async () => {
    try {
      // Используем правильный URL
      const response = await fetch(`${API_BASE_URL}/api/qa`);
      if (!response.ok) {
        // Если сервер вернул ошибку, выводим ее
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQa(data);
    } catch (error) {
      console.error("Ошибка при загрузке диалога:", error);
    }
  };

  useEffect(() => {
    // Запускаем получение данных при первой загрузке
    fetchQa();
    // и продолжаем запрашивать их каждые 3 секунды
    const interval = setInterval(fetchQa, 3000);

    // Очищаем интервал, когда компонент исчезает
    return () => clearInterval(interval);
  }, []);

  // Эта функция отправляет новый вопрос на сервер
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      // Используем правильный URL для отправки
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
      // Сразу же вызываем fetchQa, чтобы обновить статус
      fetchQa();
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
          disabled={qa.question !== ''} // Блокируем форму, пока есть активный вопрос
        />
        <button type="submit" disabled={qa.question !== ''}>
          Отправить вопрос
        </button>
      </form>
    </div>
  );
}

export default Dialogue;
