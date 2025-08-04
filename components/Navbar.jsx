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
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/" className="text-white hover:underline">Home</Link>
        {!isLoggedIn && (
          <>
            <Link href="/login" className="text-white hover:underline">Login</Link>
            <Link href="/register" className="text-white hover:underline">Register</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link href="/income" className="text-white hover:underline">Income</Link>
            <Link href="/expenses" className="text-white hover:underline">Expenses</Link>
            <Link href="/add" className="text-white hover:underline">Add</Link>
          </>
        )}
      </div>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="text-white hover:underline"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
