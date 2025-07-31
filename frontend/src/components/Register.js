import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegistered }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess('Registered! Please check your email for MFA code and login.');
      setFormData({ email: '', password: '' });
      setTimeout(() => {
        onRegistered(); // Switch to login view
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl mb-4">Register</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded">
        Register
      </button>
    </form>
  );
}

export default Register;
