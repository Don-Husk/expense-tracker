import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [step, setStep] = useState(1); // 1 = enter credentials, 2 = enter MFA code
  const [formData, setFormData] = useState({ email: '', password: '', mfaCode: '' });
  const [error, setError] = useState('');

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (step === 1) {
        // Step 1: Send login credentials
        await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        setStep(2);
        setError('');
      } else if (step === 2) {
        // Step 2: Send MFA code to verify and get JWT token
        const res = await axios.post('http://localhost:5000/api/auth/mfa-verify', {
          email: formData.email,
          code: formData.mfaCode,
        });
        onLoginSuccess(res.data.token);  // pass JWT token up to App.js
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 border rounded shadow">
      {step === 1 ? (
      //hello
        <>
          <h2 className="text-xl mb-4">Login</h2>
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
        </>
      ) : (
        <>
          <h2 className="text-xl mb-4">Enter MFA Code</h2>
          <input
            type="text"
            name="mfaCode"
            placeholder="6-digit code"
            value={formData.mfaCode}
            onChange={handleChange}
            required
            className="w-full mb-3 p-2 border rounded"
          />
        </>
      )}
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded">
        {step === 1 ? 'Login' : 'Verify'}
      </button>
    </form>
  );
}

export default Login;
