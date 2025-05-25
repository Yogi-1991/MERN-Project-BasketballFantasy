import { use, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from '../config/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', { email, name, password });      
      alert('Registered successfully. You can login now.');
      navigate('/');
    } catch (err) {
        console.log(err.response.data.errors)
        const errors = err.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      setServerError(errors[0].msg); // Show first validation error
      alert(serverError);
    } else {
      setServerError('Registration failed. Please try again.');
      alert(serverError);
    }
      
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}
