import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function AddTransaction() {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) router.push('/login');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    if (!email) return alert('User not logged in');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: Number(amount), description, email })
      });

      if (res.ok) {
        alert('Transaction added!');
        setAmount('');
        setDescription('');
      } else {
        alert('Failed to add transaction');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
        <form onSubmit={handleSubmit} className="max-w-md bg-white p-4 rounded shadow">
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={(e) => setType(e.target.value)}
              />
              Income
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={(e) => setType(e.target.value)}
              />
              Expense
            </label>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Submit</button>
        </form>
      </div>
    </>
  );
}
