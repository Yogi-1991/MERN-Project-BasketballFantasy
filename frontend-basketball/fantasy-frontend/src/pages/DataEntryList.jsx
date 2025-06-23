import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';

export default function AdminDataEntryList() {
  const [dataEntryUsers, setDataEntryUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/data-entry-users', {headers: {Authorization: localStorage.getItem('token')}});
        setDataEntryUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users', err);
        setLoading(false);
      } 
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">Data Entry Users</h1>
      <Link to="/admin/data-entry/create" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
        + Add New
      </Link>

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <table className="w-full mt-4 table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Tasks</th>
              <th className="border px-4 py-2">Is-Active</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataEntryUsers.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.dataEntryTasks?.join(', ')}</td>
                <td className="border px-4 py-2">{user.isActive ? '✅ Enabled' : '❌ Disabled'}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/admin/data-entry/edit/${user._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
