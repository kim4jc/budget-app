const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');



const db = require('./models'); // Register models to sequelize
const authRoutes = require('./routes/authRoutes'); // Authorization routing
const expenseRoutes = require('./routes/expenseRoutes'); // Expense routing
const incomeRoutes = require('./routes/incomeRoutes'); // Income routing
const binRoutes = require('./routes/binRoutes'); // Bin Routing


dotenv.config();
const app = express();


app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});

const allowedOrigins = [process.env.FRONTEND_API_URL, 'http://localhost:5173'];

app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); 
app.use('/api/income', incomeRoutes); 
app.use('/api/bins', binRoutes);

// Sync database and start server

//db.sequelize.sync({ alter: true }).then(() => {
db.sequelize.sync().then(() => {

  const PORT = process.env.BACKEND_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running and database synced on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});
