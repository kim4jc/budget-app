const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');


const db = require('./models'); // Register models to sequelize
const authRoutes = require('./routes/authRoutes'); // Fix path to match folder

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: process.env.FRONTEND_API_URL }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Sync database and start server
db.sequelize.sync({ alter: true }).then(() => {
  const PORT = process.env.BACKEND_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running and database synced on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});
