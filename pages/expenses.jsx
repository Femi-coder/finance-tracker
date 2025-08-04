import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await fetch(`/api/transactions?email=${email}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected response:', data);
          setExpenses([]);
          return;
        }

        const filtered = data.filter((txn) => txn.type === 'expense');
        setExpenses(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, tx) => sum + tx.amount, 0);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/deleteTransaction?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Expense deleted!');
        setExpenses((prev) => prev.filter((txn) => txn._id !== id));
      } else {
        alert('Failed to delete expense');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Expense Transactions</h1>
        <p className="mb-4 font-semibold text-gray-700">Total Expenses: €{totalExpenses}</p>

        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-600">No expense records found.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((txn) => (
              <li
                key={txn._id}
                className="bg-white p-4 rounded shadow border-l-4 border-red-500 flex justify-between items-center"
              >
                <div>
                  <p className="text-red-600 font-semibold">
                    €{txn.amount} — {txn.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(txn._id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
