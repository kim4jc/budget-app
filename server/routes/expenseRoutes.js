// Expense Routes

const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController.js');

router.post('/createExpense', expenseController.addExpense);

module.exports = router;

