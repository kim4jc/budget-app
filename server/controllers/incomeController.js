// Income Controller

const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.addIncome = async (req, res) => {
  try {
    console.log('POST /api/income called with:', req.body);
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
        'INSERT INTO Incomes (name, amount, userID, createdAt, updatedAt) VALUES (:name, :amount, :userID, :createdAt, :updatedAt)',
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

        newIncome = await sequelize.query(
          'SELECT * FROM Incomes WHERE userID = :userID AND name = :name AND amount = :amount AND createdAt = :now',
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
        
        res.status(201).json(newIncome[0]);
    });

  } 
  catch (error) {
    console.error('Error in addIncome:', error);   
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/income
exports.getIncome = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      const userID = info.id;

      const income = await sequelize.query(
        'SELECT * FROM Incomes WHERE userID = :userID',
        {
          replacements: { userID },
          type: sequelize.QueryTypes.SELECT
        }
      );

      res.status(200).json(income);
    });
  } catch (error) {
    console.error('Error in getIncome:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/income/:id
exports.deleteIncome = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const userID = info.id;
      const incomeID = parseInt(req.params.id, 10);

      if (isNaN(incomeID)) {
        return res.status(400).json({ message: 'Invalid income ID' });
      }

      const [income] = await sequelize.query(
        'SELECT * FROM Incomes WHERE id = :id AND userID = :userID',
        {
          replacements: { id: incomeID, userID },
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!income) {
        return res.status(404).json({ message: 'Income not found or unauthorized' });
      }

      await sequelize.query(
        'DELETE FROM Incomes WHERE id = :id AND userID = :userID',
        {
          replacements: { id: incomeID, userID },
          type: sequelize.QueryTypes.BULKDELETE
        }
      );

      res.status(200).json({ message: 'Income deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

