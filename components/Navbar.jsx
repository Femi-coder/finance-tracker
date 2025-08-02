import Link from 'next/link';
import { useEffect, useState } from 'react';
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
    alert('Logged out!');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-6">
      <Link href="/">Home</Link>
      {isLoggedIn && (
        <>
          <Link href="/add">Add</Link>
          <Link href="/income">Income</Link>
          <Link href="/expenses">Expenses</Link>
          <button onClick={handleLogout} className="ml-auto text-sm underline">
            Logout
          </button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
