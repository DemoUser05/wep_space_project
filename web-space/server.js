require('dotenv').config(); // додай на самому початку
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your-secret-key";
const { getShips, addShip } = require("./firebaseFunctions");


const users = []; // Тимчасове сховище користувачів

app.use(cors()); // Дозвіл крос-доменних запитів
app.use(express.json()); // Дозвіл обробки JSON

// Тестовий GET-запит
app.get("/", (req, res) => {
    res.send("Вітаємо! Сервер працює успішно.");
  });
  

// POST для збереження даних
app.post("/api/data", (req, res) => {
  const newData = req.body;
  console.log("Отримано дані:", newData);
  res.status(201).json({ message: "Дані успішно збережено!" });
});

// POST для реєстрації нового користувача
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Ім'я користувача та пароль обов'язкові!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "Користувача зареєстровано!" });
});

// POST для авторизації
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Невірний логін або пароль!" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware для захисту приватних маршрутів
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Токен відсутній!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Невалідний токен!" });
    req.user = user;
    next();
  });
};

// Приватний маршрут для профілю
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Ласкаво просимо, ${req.user.username}!` });
});



//Маршрут для отримання списку кораблів
app.get("/api/ships", async (req, res) => {
  try {
    const ships = await getShips(); // Викликає функцію для отримання даних із Firestore
    res.status(200).json(ships);
  } catch (error) {
    res.status(500).json({ message: "Помилка завантаження кораблів", error: error.message });
  }
});

//Маршрут для додавання нового корабля
app.post("/api/ships", async (req, res) => {
  try {
    const { name, type, capacity } = req.body;
    await addShip(name, type, capacity); // Викликає функцію для запису даних у Firestore
    res.status(201).json({ message: "Корабель додано успішно" });
  } catch (error) {
    res.status(500).json({ message: "Помилка додавання корабля", error: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});