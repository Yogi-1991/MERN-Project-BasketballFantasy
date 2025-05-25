import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

export default function  Login(){

    const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('/login', { email, password });
          localStorage.setItem('token', res.data.token);
          navigate('/dashboard');
        } catch (err) {
          alert('Login failed');
        }
      };

    return(
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
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
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Login
          </button>
          <p className="text-sm mt-4 text-center">
            Don’t have an account? <Link to="/register" className="text-blue-500">Register</Link>
          </p>
        </form>
      </div>
    );
}