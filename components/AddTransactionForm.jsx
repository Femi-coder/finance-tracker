'use client';

import { useState } from 'react';

export default function AddTransactionForm() {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description) {
      alert('Please fill in all fields');
      return;
    }

    const transaction = { type, amount: Number(amount), description };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      if (!res.ok) throw new Error('Failed to add transaction');

      alert('Transaction added!');
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to add transaction');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

      {/* Radio Buttons */}
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            name="type"
            value="income"
            checked={type === 'income'}
            onChange={(e) => setType(e.target.value)}
            className="mr-1"
          />
          Income
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="expense"
            checked={type === 'expense'}
            onChange={(e) => setType(e.target.value)}
            className="mr-1"
          />
          Expense
        </label>
      </div>

      {/* Amount */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full mb-3 px-3 py-2 border rounded text-black"
        required
      />

      {/* Description */}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full mb-3 px-3 py-2 border rounded text-black"
        required
      />

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Submit
      </button>
    </form>
  );
}
