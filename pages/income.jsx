import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function IncomePage() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }

    const fetchIncome = async () => {
      try {
        const res = await fetch(`/api/transactions?email=${email}`);
        const data = await res.json();
        const filtered = data.filter((txn) => txn.type === 'income');
        setIncome(filtered);
      } catch (err) {
        console.error('Error fetching income:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this income?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/deleteTransaction?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Income deleted!');
        setIncome((prev) => prev.filter((txn) => txn._id !== id));
      } else {
        alert('Failed to delete income');
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
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Income Transactions</h1>
        <p className="mb-4 font-semibold text-gray-700">Total Income: €{totalIncome}</p>

        {loading ? (
          <p>Loading...</p>
        ) : income.length === 0 ? (
          <p className="text-gray-600">No income records found.</p>
        ) : (
          <ul className="space-y-2">
            {income.map((txn) => (
              <li
                key={txn._id}
                className="bg-white p-4 rounded shadow border-l-4 border-green-500 flex justify-between items-center"
              >
                <div>
                  <p className="text-green-600 font-semibold">
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
