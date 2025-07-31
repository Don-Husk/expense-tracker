import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Login from './components/Login';
import Register from './components/Register'; // ⬅️ Add this import
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState('login'); // 'login' or 'register'

  // Load expenses after login
  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:5000/api/expenses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Failed to fetch expenses:', err));
  }, [token]);

  const addExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id) => {
    axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setExpenses(prev => prev.filter(e => e._id !== id)))
      .catch(err => console.error('Delete failed:', err));
  };

  const handleLoginSuccess = (jwtToken) => {
    setToken(jwtToken);
    setView(''); // switch to main app
  };

  const handleLogout = () => {
    setToken(null);
    setExpenses([]);
    setView('login');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white shadow rounded p-6">
          <p>F*ck you.</p>
          {view === 'login' ? (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <p className="mt-4 text-sm text-center">
                Don't have an account?{' '}
                <button className="text-blue-600 underline" onClick={() => setView('register')}>
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <Register onRegistered={() => setView('login')} />
              <p className="mt-4 text-sm text-center">
                Already have an account?{' '}
                <button className="text-blue-600 underline" onClick={() => setView('login')}>
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600">Personal Expense Tracker 💸</h2>

        <AddExpense onAdd={addExpense} token={token} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} token={token} />
        <AnalyticsDashboard expenses={expenses} />

        <button
          onClick={handleLogout}
          className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
