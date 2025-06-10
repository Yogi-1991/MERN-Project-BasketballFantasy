// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import AdminSidebar from './AdminSidebar';
// import { useSelector } from 'react-redux';

// export default function AdminLayout() {
//   const { userData } = useSelector((state) => state.user);
//   const sidebar = userData?.role === 'admin' ? <AdminSidebar /> : <Sidebar />;

//   return (
//     <div className="flex">
//       {sidebar}
//       <div className="flex-1 p-6 bg-orange-50 min-h-screen">
//         <Outlet />
//       </div>
//     </div>
//   );
// }
