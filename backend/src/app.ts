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
    const { ime, opis, kolicina } = req.body;

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


    const kovanecRef = await db.collection('kovanecSeznam').add({
      ime,
      opis,
      kolicina,
      slika: imageUrl[0],
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
