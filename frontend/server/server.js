const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 5000;

// PostgreSQL connection
console.log("DB Password:", process.env.DB_PASSWORD); // Debugging line

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "",
  port: process.env.DB_PORT,
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload file and generate SHA-256 hash
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.originalname);
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');

    res.send({ hash: hex });
  } catch (error) {
    res.status(500).json({ error: "Error processing file." });
  }
});

// Store main agreement in PostgreSQL
app.post('/agreements', async (req, res) => {
  const { agreementHash, ipfsCID, vendor, vendorName, transactionHash } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO main_agreements (ipfs_cid, hash, vendor_address, vendor_name, transaction_hash) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [ipfsCID, agreementHash, vendor, vendorName, transactionHash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting agreement:", error);
    res.status(500).json({ error: "Database error." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
