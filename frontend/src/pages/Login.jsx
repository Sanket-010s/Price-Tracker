import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // redirect to dashboard
    } catch (error) {
      alert("Failed to log in: " + error.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Log In</h2>
        <input 
          className="w-full border p-2 mb-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          className="w-full border p-2 mb-6 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} required 
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded transition-colors" type="submit">Log In</button>
        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Need an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
