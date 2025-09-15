const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

// --- Настройка CORS ---
// Разрешаем запросы с любого источника для максимальной простоты.
app.use(cors());
app.use(express.json());

// --- Главный и единственный эндпоинт ---
app.post('/api/question', (req, res) => {
  const { question } = req.body;

  // Проверяем, пришел ли вопрос
  if (!question) {
    return res.status(400).json({ 
      question: '', 
      answer: 'Ошибка: вопрос не может быть пустым.' 
    });
  }

  // Формируем мгновенный ответ-заглушку
  const reply = `Ева получила ваш вопрос: "${question.trim()}". Ответ формируется...`;

  // Немедленно отправляем ответ в том же запросе
  res.status(200).json({
    question: question,
    answer: reply
  });
});

// --- Запуск сервера ---
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}. Режим: Stateless.`);
});
