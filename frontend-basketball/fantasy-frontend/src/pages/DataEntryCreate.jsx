import { useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { isEmail } from 'validator';

const TASK_OPTIONS = ['teams', 'players', 'schedule', 'matchStats', 'lineups'];


export default function DataEntryCreate() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dataEntryTasks: [],
  });

  const [error, setError] = useState([]);
  const [clientError, setClientError] = useState({})
  const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

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

    const error = {};

        if(formData.name.trim() === ''){
            error.name ='Name filed is empty'
        }
        
        if(formData.email.trim() === ''){
            error.email = 'Email field is empty'
        }else if(!isEmail(formData.email)){
            error.email = 'Invalid email'
        }
    
        if(formData.password === ''){
            error.password = 'Password field is empty'
        }else if(formData.password.trim().length < 8 || formData.password.trim().length > 128){
            error.password = 'Password should be between 8 to 128 charcter'
        }
        
        if(formData.dataEntryTasks.length === 0){
            error.dataEntryTasks = 'Select the task'
        }

        if(Object.keys(error).length > 0){
            setClientError(error);
        }else{
            setClientError({})
            const formDataValues = {
                name : formData.name,
                email: formData.email,
                password: formData.password,
                dataEntryTasks: formData.dataEntryTasks
            }
             try {
                  await axios.post('/admin/dataentry/create/', formDataValues, {headers:{Authorization: localStorage.getItem('token')}});
                  navigate('/admin/data-entry-list');
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.errors || 'Failed to create user');
            }
         }
        };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Create Data Entry User</h2>
      { Array.isArray(error) ? (
                 error.map((e, i) => (
                 <p key={i} className="text-red-500 mb-2">
                    {e.msg || e}
                     </p>
                 ))
                ) : (error && <p className="text-red-500 mb-2">{error}</p>)}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={(e)=>{
            setFormData({...formData,name:e.target.value})
          }}
          
        />
        <p className="text-sm text-red-500 mb-3">{clientError.name}</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={(e)=>{
            setFormData({...formData,email:e.target.value})
          }} 
          
        />
        <p className="text-sm text-red-500 mb-3">{clientError.email}</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={formData.password}
          onChange={(e)=>{
            setFormData({...formData,password:e.target.value})
          }}
          
        />
        <p className="text-sm text-red-500 mb-3">{clientError.password}</p>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Assign Tasks</label>
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
         <p className="text-center text-sm text-red-500 mb-3">{clientError.dataEntryTasks}</p>

        </div>

        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
          Create User
        </button>
      </form>
    </div>
  );
}
