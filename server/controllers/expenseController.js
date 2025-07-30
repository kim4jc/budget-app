// Expense Controller
// This will need to include a userID field once authentication is implemented

const { Expenses } = require('../models'); 

exports.addExpense = async (req, res) => {
  try {
    console.log('POST /api/expenses called with:', req.body);
    const { name, amount } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ error: 'Name and amount are required' });
    }

    const newExpense = await Expenses.create({ name, amount });
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error in addExpense:', error);   
    res.status(500).json({ error: 'Internal server error' });
  }
};


