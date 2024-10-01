// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB Connection
const mongoUri = 'mongodb+srv://shrusonawane7:FileUplod@cluster6.udgvf.mongodb.net/fileUploader?retryWrites=true&w=majority';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// User authentication
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered' });
});

// File upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save file metadata to MongoDB
    const newFile = new File({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
    });
    
    await newFile.save();

    res.json({ message: 'File uploaded successfully', file: newFile });
});

// Retrieve all uploaded files
app.get('/files', async (req, res) => {
    try {
        const files = await File.find({});
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving files', error: err });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
