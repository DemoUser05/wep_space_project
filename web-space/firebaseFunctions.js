const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

// Функції як раніше:
const getShips = async () => {
  const ships = [];
  const querySnapshot = await db.collection("ships").get();
  querySnapshot.forEach((doc) => ships.push({ id: doc.id, ...doc.data() }));
  return ships;
};

const addShip = async (name, type, capacity) => {
  const docRef = await db.collection("ships").add({
    name: name,
    type: type,
    capacity: capacity,
  });
  return docRef.id;
};

// ✅ Отримати список місій
const getUserExpeditions = async () => {
  const missions = [];
  const querySnapshot = await db.collection("missions").get();
  querySnapshot.forEach((doc) => missions.push({ id: doc.id, ...doc.data() }));
  return missions;
};

// ✅ Додати нову місію
const addExpedition = async (missionData) => {
  const docRef = await db.collection("missions").add(missionData);
  return docRef.id;
};

module.exports = { getShips, addShip, getUserExpeditions, addExpedition };
