import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert('Registration successful');
      setEmail('');
      setPassword('');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border rounded bg-white text-gray-800"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-3 py-2 border rounded bg-white text-gray-800"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
