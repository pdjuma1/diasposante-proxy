import express from "express";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

// Upload fichier
app.post("/update-file", async (req, res) => {
  try {
    const { table, rowId, fileId } = req.body;

    const resp = await fetch(
      `https://api.baserow.io/api/database/rows/table/${table}/${rowId}/`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Token ${process.env.BASEROW_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "6785813": [{ id: fileId }]
        })
      }
    );

    const data = await resp.json();
    return res.status(resp.status).json(data);

  } catch (err) {
    console.error("UPDATE FILE ERROR:", err);
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
const multer = require("multer");
const upload = multer();

// Ajouter une ordonnance depuis GoodBarber
app.post("/ordonnance", upload.none(), async (req, res) => {
  try {
    console.log("ORDONNANCE BODY:", req.body);

    const { Ordonnance, Commentaire, patient, aidant } = req.body;

    // GoodBarber envoie Ordonnance comme une STRING JSON → on doit la parser
    const ordonnanceData = JSON.parse(Ordonnance);

    const payload = {
      Patient: [parseInt(patient)],
      Aidant: aidant ? [parseInt(aidant)] : [],
      FichierURL: ordonnanceData.url,
      NomFichier: ordonnanceData.name,
      Date: new Date().toISOString(),
      Commentaire: Commentaire || ""
    };

    const baserowResp = await fetch(
      "https://api.baserow.io/api/database/rows/table/123456/?user_field_names=true",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${process.env.BASEROW_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await baserowResp.json();
    console.log("ORDONNANCE BASEROW:", data);

    return res.status(200).json({ success: true, data });

  } catch (err) {
    console.error("ORDONNANCE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("API Proxy running on port " + PORT));

