const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Create an expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({ title, amount, category });
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
