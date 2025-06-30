import { Link, useLocation } from 'react-router-dom';
import { LogOut, Home, Users, Trophy, Gamepad, FileText, Settings, UserCog, Calendar, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';


export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const { userData } = useSelector((state) => state.user);


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
        {userData?.role === 'registered' && ( 
        <>
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
        </>
        )}
        {/* Admin Section */}
        {userData?.role === 'admin' && (
          <>
            <h3 className="text-xs uppercase text-gray-500 mt-4 mb-1">Admin Panel</h3>
            <Link to="/admin/contests" className={linkStyle('/admin/contests')}>
              <FileText className="w-5 h-5 mr-2" />
              Manage Contests
            </Link>
            <Link to="/admin/data-entry-list" className={linkStyle('/admin/data-entry-list')}>
                <Users className="w-5 h-5 mr-2" />
               Manage Data Entry
            </Link>
            
          </>
        )}


        {/* Data Entry Section */}
        {(userData?.role === 'dataentry' || userData?.role === 'admin') && (
          <>
            <h3 className="text-xs uppercase text-gray-500 mt-4 mb-1">Data Entry</h3>


            

            {(userData.dataEntryTasks?.includes('leagues') || userData?.role === 'admin')&& (
              <Link to="/data-entry/leagues" className={linkStyle('/data-entry/leagues')}> 
              <Shield className="w-5 h-5 mr-2" />
              Manage Leagues
            </Link>
            )}

           

             {(userData.dataEntryTasks?.includes('seasons') || userData?.role === 'admin')&& (
               <Link to="/data-entry/seasons" className={linkStyle('/data-entry/seasons')}>
              <Calendar className="w-5 h-5 mr-2" />
              Manage Seasons
            </Link>
            )}

            {(userData.dataEntryTasks?.includes('teams') || userData?.role === 'admin')&& (
              <Link to="/data-entry/teams" className={linkStyle('/data-entry/teams')}>
                <Users className="w-5 h-5 mr-2" />
                Manage Teams
              </Link>
            )}

            {/* {(userData.dataEntryTasks?.includes('players') || userData?.role === 'admin') && (
              <Link to="/data-entry/players" className={linkStyle('/data-entry/players')}>
                <UserCog className="w-5 h-5 mr-2" />
                Enter Players
              </Link>
            )} */}

            {(userData.dataEntryTasks?.includes('schedule')|| userData?.role === 'admin') && (
              <Link to="/data-entry/schedules" className={linkStyle('/data-entry/schedule')}>
                <Calendar className="w-5 h-5 mr-2" />
                Manage Schedule
              </Link>
            )}

            {(userData.dataEntryTasks?.includes('schedule')|| userData?.role === 'admin') && (
              <Link to="/data-entry/schedule/live-coverage/" className={linkStyle('/data-entry/schedule/live-coverage/')}>
                <Calendar className="w-5 h-5 mr-2" />
                Manage Live
              </Link>
            )}

            {(userData.dataEntryTasks?.includes('matchStats')|| userData?.role === 'admin') && (
              <Link to="/data-entry/match-stats" className={linkStyle('/data-entry/match-stats')}>
                <Trophy className="w-5 h-5 mr-2" />
                Enter Match Stats
              </Link>
            )}

            {(userData.dataEntryTasks?.includes('lineup') || userData?.role === 'admin')&& (
              <Link to="/data-entry/lineups" className={linkStyle('/data-entry/lineups')}>
                <Settings className="w-5 h-5 mr-2" />
                Enter Lineups
              </Link>
            )}
          </>
        )}

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
