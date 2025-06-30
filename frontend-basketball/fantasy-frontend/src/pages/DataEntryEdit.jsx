import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const TASK_OPTIONS = ['teams', 'players', 'schedule', 'matchStats', 'lineups','seasons','leagues'];

export default function DataEntryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dataEntryTasks: [],
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchUsers = async () => {
            try {
              const res = await axios.get(`/admin/data-entry-user/${id}`, {headers: {Authorization: localStorage.getItem('token')}});
              // setFormData(res.data);
              setFormData({
                name: res.data.name,
                email: res.data.email,
                dataEntryTasks: res.data.dataEntryTasks,
                isActive: res.data.isActive
              });
              setLoading(false);
            } catch (err) {
              console.error('Error fetching users', err);
              setLoading(false);
            } 
          };
          fetchUsers();

  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTaskToggle = (task) => {
    setFormData((prev) => {
      const exists = prev.dataEntryTasks.includes(task);
      return {
        ...prev,
        dataEntryTasks: exists
          ? prev.dataEntryTasks.filter((t) => t !== task)
          : [...prev.dataEntryTasks, task],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formdata", formData)
    try {
      await axios.put(`/admin/dataentry/${id}`, formData, {headers: {Authorization: localStorage.getItem('token')}});
      navigate('/admin/data-entry-list');
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Edit Data Entry User</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={handleChange}
          disabled
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={handleChange}
          disabled
        />

        
      <div className="mb-4">
      <label className="flex items-center space-x-2">
      <input
      type="checkbox"
      checked={formData.isActive}
      onChange={(e) =>
        setFormData({ ...formData, isActive: e.target.checked })
      }
      />
      <span>Is Active</span>
    </label>
    </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Edit Tasks</label>
          <div className="grid grid-cols-2 gap-2">
            {TASK_OPTIONS.map((task) => (
              <label key={task} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dataEntryTasks.includes(task)}
                  onChange={() => handleTaskToggle(task)}
                />
                <span>{task}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
