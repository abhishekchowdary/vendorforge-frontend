import Navbar from '../components/Navbar.jsx';

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0a10] to-[#0f0d1a]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
