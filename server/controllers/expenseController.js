
// Expense Controller
// This will need to include a userID field once authentication is implemented

const Expenses = require('../models/Expenses'); 
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.addExpense = async (req, res) => {
  try {
    console.log('POST /api/expenses called with:', req.body);
    const { name, amount } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ error: 'Name and amount are required' });
    }
    // Get JWT token from cookies
    const { token } = req.cookies;
    //return if no token found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    //verify token with secret
    jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
      if (err) {
          res.status(401).json({ message: "Invalid token" });
          return;
      }
      const userID = info.id;
      console.log(userID);
      const now = new Date().toISOString();

      await sequelize.query(
        'INSERT INTO Expenses (name, amount, userID, createdAt, updatedAt) VALUES (:name, :amount, :userID, :createdAt, :updatedAt)',
        {
          replacements: {
            name,
            amount,
            userID,
            createdAt: now,
            updatedAt: now
          },
          type: sequelize.QueryTypes.INSERT
        });

        newExpense = await sequelize.query(
          'SELECT * FROM Expenses WHERE userID = :userID AND name = :name AND amount = :amount AND createdAt = :now',
          {
            replacements: {
              name,
              amount,
              userID,
              now,
            },
            type: sequelize.QueryTypes.SELECT
          }
        );
        
        res.status(201).json(newExpense[0]);
    });

  } 
  catch (error) {
    console.error('Error in addExpense:', error);   
    res.status(500).json({ error: 'Internal server error' });
  }
};


