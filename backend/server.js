const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// Render предоставляет порт через переменную окружения PORT, используем ее
const port = process.env.PORT || 3002;

const questionPath = path.join(__dirname, 'question.txt');
const answerPath = path.join(__dirname, 'answer.txt');

let deletionTimeout = null;

// --- Функция инициализации ---
// Создает файлы, если они не существуют.
function initializeFiles() {
  if (!fs.existsSync(questionPath)) {
    fs.writeFileSync(questionPath, '', 'utf8');
    console.log('Файл question.txt создан.');
  }
  if (!fs.existsSync(answerPath)) {
    fs.writeFileSync(answerPath, '', 'utf8');
    console.log('Файл answer.txt создан.');
  }
}

// Настраиваем CORS, чтобы разрешить запросы с нашего фронтенда
const corsOptions = {
  origin: 'https://sergbik.github.io',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// --- Helper Functions ---

function clearFiles() {
  fs.writeFile(questionPath, '', 'utf8', () => {});
  fs.writeFile(answerPath, '', 'utf8', () => {});
  console.log("Файлы вопроса и ответа были очищены.");
}

function scheduleDeletion() {
  if (deletionTimeout) {
    clearTimeout(deletionTimeout);
  }
  deletionTimeout = setTimeout(clearFiles, 300000); // 5 minutes
  console.log("Автоматическое удаление запланировано через 5 минут.");
}

function generateReply(question) {
  // For now, a simple placeholder reply.
  // In the future, this could involve a call to a generative model.
  const reply = `Ева получила ваш вопрос: "${question.trim()}". Ответ формируется...`;
  
  fs.writeFile(answerPath, reply, 'utf8', (err) => {
    if (err) {
      console.error("Ошибка при записи ответа:", err);
      return;
    }
    console.log("Ответ был сгенерирован и записан.");
    scheduleDeletion();
  });
}

// --- File Watcher ---
// Запускаем наблюдатель только после того, как убедились, что файлы существуют
function startFileWatcher() {
    fs.watch(questionPath, (eventType, filename) => {
        if (eventType === 'change') {
            fs.readFile(questionPath, 'utf8', (err, data) => {
            if (err || !data.trim()) {
                return; // Ignore if error or empty
            }
            console.log("Обнаружен новый вопрос...");
            generateReply(data);
            });
        }
    });
    console.log("Наблюдатель за файлом вопроса успешно запущен.");
}


// --- API Endpoints ---

app.get('/api/qa', async (req, res) => {
  try {
    // Используем асинхронное чтение, но с проверкой на существование
    if (fs.existsSync(questionPath) && fs.existsSync(answerPath)) {
        const question = await fs.promises.readFile(questionPath, 'utf8');
        const answer = await fs.promises.readFile(answerPath, 'utf8');
        res.json({ question, answer });
    } else {
        res.json({ question: '', answer: '' });
    }
  } catch (err) {
    res.status(500).json({ message: "Ошибка на сервере." });
  }
});

app.post('/api/question', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: "Вопрос не может быть пустым." });
  }

  // Clear the answer file to indicate a new cycle
  fs.writeFile(answerPath, '', 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка на сервере." });
    }
    // Write the new question
    fs.writeFile(questionPath, question, 'utf8', (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Ошибка на сервере." });
      }
      res.status(200).json({ message: 'Ваш вопрос получен.' });
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
  // 1. Создаем файлы, если их нет
  initializeFiles();
  // 2. Очищаем их для чистого старта
  clearFiles();
  // 3. Запускаем наблюдатель
  startFileWatcher();
});