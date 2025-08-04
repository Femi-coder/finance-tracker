import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true); // prevent initial flicker

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) {
        router.push('/login');
      } else {
        setUserEmail(storedEmail);
        fetchTransactions(storedEmail);
        setCheckingAuth(false);
      }
    }
  }, []);

  const fetchTransactions = async (email) => {
    try {
      const res = await fetch(`/api/transactions?email=${email}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error('Expected array, got:', data);
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Dashboard</h1>
        {userEmail ? (
          <p className="mb-6 text-gray-700 font-semibold">Welcome back, {userEmail}!</p>
        ) : (
          <p className="mb-6 text-gray-400 italic">Checking user...</p>
        )}

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded shadow text-center">
            <p className="text-lg font-semibold">Total Income</p>
            <p className="text-xl font-bold">€{totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded shadow text-center">
            <p className="text-lg font-semibold">Total Expenses</p>
            <p className="text-xl font-bold">€{totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow text-center">
            <p className="text-lg font-semibold">Balance</p>
            <p className="text-xl font-bold">€{balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 w-full max-w-md px-4 py-2 border rounded bg-white text-gray-800 shadow-sm"
        />

        {/* Transactions List */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-600">No matching transactions found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map((tx) => (
              <li
                key={tx._id}
                className={`flex justify-between items-center bg-white p-4 rounded shadow border-l-4 ${
                  tx.type === 'income' ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type}: €{tx.amount.toFixed(2)} — {tx.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
