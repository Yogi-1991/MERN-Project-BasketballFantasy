// import { Link, useLocation } from 'react-router-dom';
// import { Home, List, Settings, Trophy } from 'lucide-react';
// import { useSelector } from 'react-redux';

// export default function AdminSidebar({ onLogout }) {
//   const { userData } = useSelector(state => state.user);
//   const location = useLocation();
//   const isActive = (path) => location.pathname === path;
//   const linkStyle = (path) =>
//     `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
//       isActive(path) ? 'bg-orange-100 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-orange-50'
//     }`;

//   return (
//     <div className="h-screen w-64 bg-white shadow-lg border-r">
//       <div className="p-6 border-b border-orange-200">
//         <h1 className="text-2xl font-bold text-orange-600">🏀 Admin Panel</h1>
//         <p className="text-xs mt-1 text-gray-500">{userData?.email}</p>
//       </div>
//       <nav className="flex flex-col p-4 space-y-2">
//         <Link to="/admin/leagues" className={linkStyle('/admin/leagues')}>
//           <List className="w-5 h-5 mr-2" /> Leagues
//         </Link>
//         <Link to="/admin/seasons" className={linkStyle('/admin/seasons')}>
//           <List className="w-5 h-5 mr-2" /> Seasons
//         </Link>
//         <Link to="/admin/contests" className={linkStyle('/admin/contests')}>
//           <Trophy className="w-5 h-5 mr-2" /> Contests
//         </Link>
//         <button
//           onClick={onLogout}
//           className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-all"
//         >
//           <Settings className="w-5 h-5 mr-2" /> Logout
//         </button>
//       </nav>
//     </div>
//   );
// }
