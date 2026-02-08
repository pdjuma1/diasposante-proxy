import express from "express";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json()); // on attend du vrai JSON

const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

// Upload fichier
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const resp = await fetch("https://api.baserow.io/api/user-files/upload-file/", {
      method: "POST",
      headers: { "Authorization": `Token ${BASEROW_TOKEN}` },
      body: formData
    });

    const data = await resp.json();
    return res.status(resp.status).json(data);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Créer une ligne
app.post("/create", async (req, res) => {
  try {
    console.log("CREATE BODY:", req.body);

    const resp = await fetch(
      `https://api.baserow.io/api/database/rows/table/${req.body.table}/?user_field_names=true`,
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${BASEROW_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body.data)
      }
    );

    const data = await resp.json();
    console.log("CREATE RESP STATUS:", resp.status, "DATA:", data);
    return res.status(resp.status).json(data);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une ligne
app.post("/update", async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);

    const resp = await fetch(
      `https://api.baserow.io/api/database/rows/table/${req.body.table}/${req.body.id}/?user_field_names=true`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Token ${BASEROW_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body.data)
      }
    );

    const data = await resp.json();
    console.log("UPDATE RESP STATUS:", resp.status, "DATA:", data);
    return res.status(resp.status).json(data);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => console.log("API Proxy running on port 10000"));

