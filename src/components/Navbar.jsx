import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? 'nav-link-active' : ''}`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/5">
      <div className="container-px h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700"></div>
          <span className="text-white font-semibold">VendorForge</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/payments" className={linkClass}>Payments</NavLink>
          <NavLink to="/configurations" className={linkClass}>Configurations</NavLink>
          <NavLink to="/test-cases" className={linkClass}>Test Cases</NavLink>
        </nav>
      </div>
    </header>
  );
}
