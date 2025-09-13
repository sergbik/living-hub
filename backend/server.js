const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3002;

const questionPath = path.join(__dirname, 'question.txt');
const answerPath = path.join(__dirname, 'answer.txt');

let deletionTimeout = null;

app.use(cors());
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

// --- API Endpoints ---

app.get('/api/qa', async (req, res) => {
  try {
    const question = await fs.promises.readFile(questionPath, 'utf8');
    const answer = await fs.promises.readFile(answerPath, 'utf8');
    res.json({ question, answer });
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
  console.log(`Сервер запущен на http://localhost:${port}`);
  // Clear files on start to ensure a clean state
  clearFiles();
});