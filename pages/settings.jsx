import Navbar from '../components/Navbar';

export default function Settings() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white pl-52 p-8">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p>Customize your app preferences here (e.g. currency, theme).</p>
      </div>
    </>
  );
}
