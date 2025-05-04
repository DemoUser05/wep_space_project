const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // переконайся, що файл існує

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Функція для отримання кораблів
const getShips = async () => {
  const ships = [];
  const querySnapshot = await db.collection("ships").get();
  querySnapshot.forEach((doc) => ships.push({ id: doc.id, ...doc.data() }));
  return ships;
};

// Функція для додавання корабля
const addShip = async (name, type, capacity) => {
  const docRef = await db.collection("ships").add({
    name: name,
    type: type,
    capacity: capacity,
  });
  return docRef.id;
};

module.exports = { getShips, addShip };
