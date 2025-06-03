import { Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Users, Trophy, Gamepad } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) =>
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive(path)
        ? 'bg-orange-100 text-orange-600 font-semibold'
        : 'text-gray-700 hover:bg-orange-50'
    }`;

  return (
    <div className="h-screen w-64 bg-white shadow-lg border-r">
      <div className="p-6 border-b border-orange-200">
        <h1 className="text-2xl font-bold text-orange-600">🏀 Fantasy Hoops</h1>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link to="/dashboard" className={linkStyle('/dashboard')}>
          <Home className="w-5 h-5 mr-2" />
          Dashboard
        </Link>
        <Link to="/my-team" className={linkStyle('/my-team')}>
          <Users className="w-5 h-5 mr-2" />
          My Team
        </Link>
        <Link to="/matches" className={linkStyle('/matches')}>
          <Gamepad className="w-5 h-5 mr-2" />
          Matches
        </Link>
        <Link to="/contests" className={linkStyle('/contests')}>
          <Trophy className="w-5 h-5 mr-2" />
          Contests
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
}
