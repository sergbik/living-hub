import React, { useState } from 'react';
import './Dialogue.css';

// URL нашего бэкенда
const API_URL = 'https://living-hub.onrender.com/api/question';

function Dialogue() {
  // Стейт для текста в поле ввода
  const [inputValue, setInputValue] = useState('');
  // Стейт для отображения вопроса и ответа
  const [display, setDisplay] = useState({ question: '', answer: '' });
  // Стейт для состояния отправки
  const [isSending, setIsSending] = useState(false);

  // Функция, которая вызывается при отправке формы
  const handleSubmit = async (event) => {
    // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    event.preventDefault();

    // Проверяем, что поле не пустое и запрос еще не отправляется
    if (!inputValue.trim() || isSending) {
      return;
    }

    // Переходим в состояние отправки
    setIsSending(true);
    setDisplay({ question: inputValue, answer: 'Соединение с сервером...' });

    try {
      // Отправляем запрос на сервер
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputValue }),
      });

      // Получаем ответ от сервера
      const data = await response.json();

      // Если сервер ответил ошибкой, выбрасываем ее
      if (!response.ok) {
        throw new Error(data.answer || 'Неизвестная ошибка сервера');
      }

      // Если все хорошо, обновляем отображение
      setDisplay(data);

    } catch (error) {
      // Если произошла ошибка сети или любая другая
      console.error("Ошибка в handleSubmit:", error);
      setDisplay({ 
        question: inputValue, 
        answer: `Произошла ошибка: ${error.message}` 
      });
    } finally {
      // В любом случае выходим из состояния отправки
      setIsSending(false);
      setInputValue(''); // Очищаем поле ввода
    }
  };

  return (
    <div className="dialogue">
      <h2>Живой Диалог</h2>
      
      <div className="qa-display">
        {display.question && (
          <div className="question-section">
            <strong>Вопрос:</strong>
            <p>{display.question}</p>
          </div>
        )}
        {display.answer && (
          <div className="answer-section">
            <strong>Ответ Евы:</strong>
            <p>{display.answer}</p>
          </div>
        )}
      </div>

      {/* Форма для отправки вопроса */}
      <form onSubmit={handleSubmit} className="send-message-form">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Задайте свой вопрос здесь..."
          rows="3"
          disabled={isSending} // Блокируем поле во время отправки
        />
        <button type="submit" disabled={isSending}>
          {isSending ? 'Отправка...' : 'Отправить вопрос'}
        </button>
      </form>
    </div>
  );
}

export default Dialogue;
