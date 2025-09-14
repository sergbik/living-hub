const express = require('express');
const cors = require('cors');
const redis = require('redis');

const app = express();
const port = process.env.PORT || 3002;

// --- Redis Client Initialization ---
// Используем URL из переменных окружения, который предоставит Render
const redisUrl = process.env.REDIS_URL;
const client = redis.createClient({
  url: redisUrl
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await client.connect();
    console.log('Успешное подключение к Redis.');
  } catch (err) {
    console.error('Не удалось подключиться к Redis:', err);
  }
})();

let deletionTimeout = null;

app.use(cors());
app.use(express.json());

// --- Helper Functions ---

async function clearRedisKeys() {
  try {
    await client.del('question', 'answer');
    console.log("Ключи вопроса и ответа в Redis были очищены.");
  } catch (err) {
    console.error("Ошибка при очистке ключей в Redis:", err);
  }
}

function scheduleDeletion() {
    if (deletionTimeout) {
        clearTimeout(deletionTimeout);
    }
    deletionTimeout = setTimeout(clearRedisKeys, 300000); // 5 minutes
    console.log("Автоматическое удаление ключей Redis запланировано через 5 минут.");
}


async function generateReply(question) {
  const reply = `Ева получила ваш вопрос: "${question.trim()}". Ответ формируется...`;
  try {
    await client.set('answer', reply);
    console.log("Ответ был сгенерирован и записан в Redis.");
    scheduleDeletion();
  } catch (err) {
    console.error("Ошибка при записи ответа в Redis:", err);
  }
}

// --- API Endpoints ---

app.get('/api/qa', async (req, res) => {
  try {
    const question = await client.get('question');
    const answer = await client.get('answer');
    res.json({ question: question || '', answer: answer || '' });
  } catch (err) {
    console.error("Ошибка при чтении из Redis:", err);
    res.status(500).json({ message: "Ошибка на сервере." });
  }
});

app.post('/api/question', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: "Вопрос не может быть пустым." });
  }

  try {
    // Set the new question and clear the answer
    await client.set('question', question);
    await client.del('answer');
    
    // Since there's no file watcher, we trigger the reply generation directly
    generateReply(question);

    res.status(200).json({ message: 'Ваш вопрос получен.' });
  } catch (err) {
    console.error("Ошибка при записи в Redis:", err);
    res.status(500).json({ message: "Ошибка на сервере." });
  }
});

app.listen(port, async () => {
  console.log(`Сервер запущен на порту ${port}`);
  // Clear keys on start to ensure a clean state
  await clearRedisKeys();
});