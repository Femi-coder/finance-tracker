import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(!!email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="space-x-4">
        {isLoggedIn && (
          <>
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            <Link href="/income" className="text-blue-600 hover:underline">Income</Link>
            <Link href="/expenses" className="text-blue-600 hover:underline">Expenses</Link>
            <Link href="/add" className="text-blue-600 hover:underline">Add</Link>
          </>
        )}
      </div>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
        ) : (
          <>
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link href="/register" className="ml-4 text-blue-600 hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
