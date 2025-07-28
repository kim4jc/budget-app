const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const authRoutes = require('../routes/authRoutes');

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: process.env.FRONTEND_API_URL }));
app.use(express.json());
app.use(cookieParser());

// Mount auth routes at /api/auth
app.use('/api/auth', authRoutes);

// ...mount other route groups similarly
app.use('/bins', require('./routes/binRoutes'));

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));