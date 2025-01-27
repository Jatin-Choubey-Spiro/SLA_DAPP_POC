const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import cors

const app = express();
const port = 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(cors()); // Use cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.originalname);
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  const hex = hashSum.digest('hex');
  res.send({ hash: hex });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});