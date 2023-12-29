import express, { Request, Response } from "express";
import admin from 'firebase-admin'
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword } from "firebase/auth";

const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use('/data/images', express.static(path.join(__dirname, 'data/images')));

const PORT = process.env.PORT || 3000;

const serviceAccount = require("../privatekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseConfig = {
  apiKey: "AIzaSyB4AnA3tQdEsmR-QR5RrO6CswmlS38h5Aw",
  authDomain: "coincatcher-7807a.firebaseapp.com",
  projectId: "coincatcher-7807a",
  storageBucket: "coincatcher-7807a.appspot.com",
  messagingSenderId: "606108606548",
  appId: "1:606108606548:web:acd2cdca1c7c5031254dc1"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = admin.firestore();

app.get("/", (req: Request, res: Response) => {
  res.send("Dobrodošli na backendu!");
});

app.post("/test", async (req: Request, res: Response) => {
  try {
    const result = await db.collection("test").add({
      test: "prvi",
      test2: "drugi",
    });

    console.log("Dokument ID:", result.id);

    res.status(200).json({ message: "Dokument uspešno dodan", documentId: result.id });
  } catch (error) {
    console.error("Napaka pri dodajanju dokumenta:", error);
    res.status(500).json({ error: "Napaka notranjega strežnika," });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userCredential = await admin.auth().createUser({
      email,
      password
    });

    await db.collection('users').doc(userCredential.uid).set({
      email: userCredential.email
    });

    res.status(200).json({ message: "Registracija uspešna", user: userCredential });
  } catch (error: any) {
    console.error("Napaka pri registraciji:", error.message);
    res.status(500).json({ error: "Napaka pri registraciji:", message: error.message });
  }
});

app.post("/login", async (req:Request, res:Response) => {
  const {email, password} = req.body;
  try {
    const user = await signInWithEmailAndPassword(auth, email, password)
    res.status(200).json({message: "Prijava uspela", user: user})
  }catch (error: any){
    console.error("Napaka pri prijavi:", error.message);
    res.status(500).json({ error: "Napaka pri prijavi:", message: error.message });
  }
})

app.get('/random-coin', (req, res) => {
  // Read the JSON file
  fs.readFile(path.join(__dirname, '..', 'data', 'kovanci.json'), 'utf8', (err: any, data: string) => {
    if (err) {
      res.status(500).send('Server error reading coin data');
      return;
    }
    
    // Parse the JSON data
    const coins = JSON.parse(data);

    // Select a random coin
    const randomCoin = coins[Math.floor(Math.random() * coins.length)];

    // Return the random coin data
    res.json(randomCoin);
  });
});

app.listen(PORT, () => {
  console.log(`Strežnik posluša na portu ${PORT}`);
});
