import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';  // import your CSS file

function AddExpense({ token, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/expenses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAdd(res.data);
      setFormData({ title: '', amount: '', category: '' });
    } catch (error) {
      console.error('Failed to add expense:', error.response?.data || error.message);
      // Optionally, handle error state here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Expense Title"
        className="form-input"
        required
      />
      <input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="form-input"
        required
      />
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="form-input"
        required
      />
      <button
        type="submit"
        className="button"
      >
        Add Expense
      </button>
    </form>
  );
}

export default AddExpense;
