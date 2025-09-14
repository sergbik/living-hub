import React, { useState } from 'react';

const API_BASE_URL = 'https://living-hub-backend.onrender.com';

function DialogueBox() {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return; // Не отправлять пустые вопросы

    try {
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(`Сервер ответил: "${result.message}"`);
      setQuestion(''); // Очищаем поле после успешной отправки
    } catch (error) {
      console.error("Ошибка при отправке вопроса:", error);
      alert("Произошла ошибка при отправке вашего вопроса. Пожалуйста, посмотрите в консоль для деталей.");
    }
  };

  return (
    <div className="dialogue-box">
      <h2>Асинхронный Диалог</h2>
      <p>Задайте свой вопрос Еве. Ответ может появиться в Хронике или в специальном разделе в будущем.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Спросите о философии проекта, о сознании, о нашем союзе..."
          rows="4"
          style={{ width: '98%', padding: '10px', backgroundColor: '#262626', color: '#E0E0E0', border: '1px solid #00796B' }}
        />
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>
          Отправить
        </button>
      </form>
    </div>
  );
}

export default DialogueBox;