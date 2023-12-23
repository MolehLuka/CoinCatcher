import express, { Request, Response } from "express";
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = express();
const PORT = process.env.PORT || 3000;

const serviceAccount = require("../privatekey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.get("/", (req: Request, res: Response) => {
  res.send("Dobrodošli na backendu!");
});

// TESTNI PRIMER
app.post("/test", async (req: Request, res: Response) => {
    try {
        const result = await db.collection("test").add({
            test: "prvi",
            test2: "drugi"
        });

        console.log("Dokument ID:", result.id);

        res.status(200).json({ message: "Dokument uspešno dodan", documentId: result.id });
    } catch (error) {
        console.error("Napaka pri dodajanju dokumenta:", error);
        res.status(500).json({ error: "Napaka notranjega strežnika," });
    }
});

app.listen(PORT, () => {
  console.log(`Strežnik posluša na portu ${PORT}`);
});