import express, { Request, Response } from "express";
import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  Auth,
  signInWithEmailAndPassword,
} from "firebase/auth";
var cors = require("cors");

const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use("/data/images", express.static(path.join(__dirname, "data/images")));

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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
  appId: "1:606108606548:web:acd2cdca1c7c5031254dc1",
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

    res
      .status(200)
      .json({ message: "Dokument uspešno dodan", documentId: result.id });
  } catch (error) {
    console.error("Napaka pri dodajanju dokumenta:", error);
    res.status(500).json({ error: "Napaka notranjega strežnika," });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  
  const { email, password , firstName, lastName, telefonskaSt} = req.body;
  try {
    const userCredential = await admin.auth().createUser({
      email,
      password,
    });

    console.log(firstName)

    await db.collection('users').doc(userCredential.uid).set({
      email: userCredential.email,
      firstName: firstName,
      lastName: lastName,
      telefonskaSt: telefonskaSt
    });

    await db.collection('userCoinCollections').doc(userCredential.uid).set({
      coins: []
    });

    res
      .status(200)
      .json({ message: "Registracija uspešna", user: userCredential });
  } catch (error: any) {
    console.error("Napaka pri registraciji:", error.message);
    res
      .status(500)
      .json({ error: "Napaka pri registraciji:", message: error.message });
  }
});

app.get("/getUser/:uid", async (req: Request, res: Response) => {
  
  const  { uid }  = req.params;

  console.log(uid)
  try {

    const userDoc = await db.collection('users').doc(uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      res.status(200).json({ message: "User data retrieved successfully", user: userData });
    } else {
      res.status(404).json({ error: "User not found", message: "User data not available for the given UID" });
    }
  } catch (error: any) {
    console.error("Error retrieving user data:", error.message);
    res.status(500).json({ error: "Error retrieving user data", message: error.message });
  }
});

app.post("/logout/:uid", async (req, res) => {
  const { uid } = req.params;
  console.log(uid)
  try {

   await admin.auth().revokeRefreshTokens(uid);

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});


const storage = admin.storage();
const storageBucketName = 'gs://coincatcher-7807a.appspot.com'; 
const storageSubdirectory = 'images';

const multer = require('multer');

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

app.post("/dodajSvojKovanec", upload.single('slika'), async (req: Request , res: Response) => {
  try {
    
    const { ime, opis, kolicina, telefonskaSt, datum, imepriimek, cena } = req.body;
/*
    if (!req.file) {
      console.log(req.file)
      return res.status(400).json({ error: 'No image file provided' });
    }

    const image = req.file.buffer; 

    const imageFileName = `${storageSubdirectory}/${Date.now()}_slika.jpg`;
    const bucket = storage.bucket(storageBucketName);

    await bucket.file(imageFileName).save(image, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    const imageUrl = await bucket.file(imageFileName).getSignedUrl({
      action: 'read',
      expires: '01-01-2100',
    });
*/

    const kovanecRef = await db.collection('kovanecSeznam').add({
      ime,
      opis,
      kolicina,
     // slika: imageUrl[0],
     slika: 'https://as2.ftcdn.net/v2/jpg/03/16/24/49/1000_F_316244961_4Kch7qlXUf8accn4wXUK4vA4ZfPMmpPh.jpg',
      telefonskaSt,
      datum,
      imepriimek,
      cena
    });

    res.status(201).json({ message: 'Kovanec uspešno dodan', id: kovanecRef.id });
  } catch (error) {
    console.error('Napaka pri dodajanju kovanca:', error);
    res.status(500).json({ error: 'Napaka pri dodajanju kovanca' });
  }
});

app.get("/pridobiKovanceTrznica", async (req: Request, res: Response) => {
  try {
    console.log("Trznica se je klicala")
    const snapshot = await db.collection("kovanecSeznam").get();

    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data(),
    }));

    res.status(200).json({ message: "Dokumenti uspešno pridobljeni", documents });
  } catch (error) {
    console.error("Napaka pri pridobivanju dokumentov:", error);
    res.status(500).json({ error: "Napaka notranjega strežnika" });
  }
});


app.get('/random-coin', async (req, res) => {
  try {
    const kovanciData = await db.collection('kovanciData').get();
    const coins: any[] = [];
    kovanciData.forEach((doc) => {
      coins.push({ id: doc.id, ...doc.data() });
    });

    // Select a random coin
    const randomCoin = coins[Math.floor(Math.random() * coins.length)];
    res.json(randomCoin);
  } catch (err) {
    res.status(500).send('Server error accessing Firestore');
  }
});


app.post('/dodajKovanecVCollection', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const coinData = req.body.coinData;

    const userCollectionRef = db.collection('userCoinCollections').doc(userId);

    const doc = await userCollectionRef.get();

    if (!doc.exists) {
      // dokumet ne obstaja, ustvari ga
      await userCollectionRef.set({ coins: [coinData] });
      res.status(200).json({ message: 'Kovanec je bil dodan v collection' });
    } else {
      // Check if the coin already exists in the collection
      const userCollection = doc.data();
      if (userCollection && userCollection.coins.some((coin: { id: any; }) => coin.id === coinData.id)) {
        // kovanec ze obstaja v collectionu
        res.status(409).json({ message: 'Kovanec je že v collectionu' });
      } else {
        // kovanec ne obstaja v collectionu, dodaj ga
        await userCollectionRef.update({
          coins: admin.firestore.FieldValue.arrayUnion(coinData)
        });
        res.status(200).json({ message: 'Kovanec je bil dodan v collection' });
      }
    }
  } catch (error) {
    console.error('Napaka pri dodajanju kovanca v collection:', error);
    res.status(500).json({ error: 'Napaka pri dodajanju kovanca v collection' });
  }
});

app.get('/pridobiKovanceCollection', async (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).json({ error: 'User ID ni bil podan' });
  }

  try {
    const userCollectionRef = db.collection('userCoinCollections').doc(userId as string);
    const doc = await userCollectionRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Collection ni bil najden' });
    }

    return res.status(200).json(doc.data()?.coins ?? []);
  } catch (error) {
    console.error('Error fetching user collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/login", async (req:Request, res:Response) => {

  const {email, password} = req.body;
  console.log(email,password)
  try {
    const user = await signInWithEmailAndPassword(auth, email, password)
    console.log(user)
    res.status(200).json({message: "Prijava uspela", user: user.user.uid})
  }catch (error: any){
    console.error("Napaka pri prijavi:", error.message);
    res
      .status(500)
      .json({ error: "Napaka pri prijavi:", message: error.message });
  }
});


app.get("/categories", (req, res) => {
  res.json(["vsi", "ime", "opis", "kolicina"]);
});

app.listen(PORT, () => {
  console.log(`Strežnik posluša na portu ${PORT}`);
});
