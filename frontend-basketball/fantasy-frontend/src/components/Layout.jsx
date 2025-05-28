import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../slices/userSlice';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    toast.success('Logged out successfully 👋');
    navigate('/');
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 bg-orange-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
