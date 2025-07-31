import React from 'react';
import axios from 'axios';
import '../App.css';

function ExpenseList({ expenses, onDelete, token }) {

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(id);
    } catch (error) {
      console.error('Failed to delete expense:', error.response?.data || error.message);
      // Optionally, handle error state here
    }
  };

  return (
    <div>
      <h3 className="analytics-title">Expense History</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp._id} className="expense-item">
            <div>
              <p className="expense-title">{exp.title}</p>
              <p className="expense-details">₹{exp.amount} | {exp.category}</p>
            </div>
            <button
              onClick={() => handleDelete(exp._id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
