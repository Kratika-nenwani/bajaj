const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 8080;

// Middleware
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /bfhl endpoint
app.post('/bfhl', upload.single('file_b64'), (req, res) => {
  const { data, file_b64 } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, error: 'Invalid data format' });
  }

  const numbers = [];
  const alphabets = [];
  let highestLowercase = '';
  let isPrimeFound = false;
  let fileValid = false;
  let fileMimeType = '';
  let fileSizeKB = 0;

  data.forEach(item => {
    if (!isNaN(item)) {
      numbers.push(item);
      if (isPrime(parseInt(item))) {
        isPrimeFound = true;
      }
    } else if (/^[a-zA-Z]$/.test(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase()) {
        if (item > highestLowercase) {
          highestLowercase = item;
        }
      }
    }
  });

  if (file_b64) {
    try {
      const fileBuffer = Buffer.from(file_b64, 'base64');
      fileValid = true;
      fileMimeType = 'image/png'; 
      fileSizeKB = Math.round(fileBuffer.length / 1024); 
    } catch (error) {
      fileValid = false;
    }
  }

  const user_id = 'kratika_nenwani_18102003';  
  const email = 'john@xyz.com';
  const roll_number = '0827AL211031';

  const response = {
    is_success: true,
    user_id: user_id,
    email: email,
    roll_number: roll_number,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: isPrimeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB
  };

  res.json(response);
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
  const response = {
    operation_code: 1
  };

  res.status(200).json(response);
});

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
