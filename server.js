import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    const formData = new FormData();
    formData.append("file", new Blob([req.file.buffer]), req.file.originalname);

    const uploadResp = await fetch("https://baserow.io/api/user-files/upload-file/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${BASEROW_TOKEN}`
      },
      body: formData
    });

    const data = await uploadResp.json();

    if (!uploadResp.ok) {
      return res.status(500).json({ error: "Erreur upload Baserow", details: data });
    }

    return res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log("API Proxy running on port " + PORT);
});
