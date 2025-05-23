import React, { useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
        const res = await api.post('/api/token/', {
          username,
          password,
        });
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        navigate('/onboarding');
      } catch (err: any) {
        setError('Invalid credentials');
      }
    };
  
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-80">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mb-6"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-purple-600 text-white py-2 rounded">Login</button>
        </form>
      </div>
    );
  }