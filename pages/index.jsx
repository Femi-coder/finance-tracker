import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [incomeCategoryFilter, setIncomeCategoryFilter] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
    } else {
      setUserEmail(email);
      fetchTransactions(email);
      setCheckingAuth(false);
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

  const filtered = transactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔍 Group by category
  const groupedByCategory = filtered.reduce((groups, tx) => {
    const cat = tx.category || 'Uncategorized';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(tx);
    return groups;
  }, {});

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
        <p className="mb-6 text-gray-700 font-semibold">Welcome back, {userEmail}!</p>

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

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-10">
            {/* INCOME GROUP */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-green-700">Income</h2>
                <select
                  value={incomeCategoryFilter}
                  onChange={(e) => setIncomeCategoryFilter(e.target.value)}
                  className="px-3 py-1 border rounded bg-white text-gray-800"
                >
                  <option value="">All Categories</option>
                  <option value="Salary">Salary</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Investments">Investments</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {Object.entries(groupedByCategory)
                .filter(([_, txns]) =>
                  txns.some(
                    (tx) =>
                      tx.type === 'income' &&
                      (incomeCategoryFilter === '' || tx.category === incomeCategoryFilter)
                  )
                )
                .map(([category, txns]) => {
                  const incomeTxns = txns.filter(
                    (tx) =>
                      tx.type === 'income' &&
                      (incomeCategoryFilter === '' || tx.category === incomeCategoryFilter)
                  );
                  const total = incomeTxns.reduce((sum, tx) => sum + tx.amount, 0);
                  return (
                    <div key={`income-${category}`} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{category}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Total in {category}: €{total.toFixed(2)}
                      </p>
                      <ul className="space-y-2">
                        {incomeTxns.map((tx) => (
                          <li
                            key={tx._id}
                            className="bg-white p-4 rounded shadow border-l-4 border-green-500 flex justify-between items-center"
                          >
                            <div>
                              <p className="text-green-600 font-semibold">
                                €{tx.amount.toFixed(2)} — {tx.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(tx.date).toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>

            {/* EXPENSES GROUP */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-red-700">Expenses</h2>
                <select
                  value={expenseCategoryFilter}
                  onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                  className="px-3 py-1 border rounded bg-white text-gray-800"
                >
                  <option value="">All Categories</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Bills">Bills</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {Object.entries(groupedByCategory)
                .filter(([_, txns]) =>
                  txns.some(
                    (tx) =>
                      tx.type === 'expense' &&
                      (expenseCategoryFilter === '' || tx.category === expenseCategoryFilter)
                  )
                )
                .map(([category, txns]) => {
                  const expenseTxns = txns.filter(
                    (tx) =>
                      tx.type === 'expense' &&
                      (expenseCategoryFilter === '' || tx.category === expenseCategoryFilter)
                  );
                  const total = expenseTxns.reduce((sum, tx) => sum + tx.amount, 0);
                  return (
                    <div key={`expense-${category}`} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{category}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Total in {category}: €{total.toFixed(2)}
                      </p>
                      <ul className="space-y-2">
                        {expenseTxns.map((tx) => (
                          <li
                            key={tx._id}
                            className="bg-white p-4 rounded shadow border-l-4 border-red-500 flex justify-between items-center"
                          >
                            <div>
                              <p className="text-red-600 font-semibold">
                                €{tx.amount.toFixed(2)} — {tx.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(tx.date).toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
