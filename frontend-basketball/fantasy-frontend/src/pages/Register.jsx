import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import {isEmail} from 'validator';
import axios from '../config/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); 
  const [serverError, setServerError] = useState('');
  const [clientError, setClientError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = {};
    if(name.trim() === ''){
        error.name = 'Name field is empty'
    }

    if(email.trim() === ''){
        error.email = 'Email field is empty'
    }else if(!isEmail(email)){
        error.email = 'Invalid email'
    }

    if(password === ''){
        error.password = 'Password field is empty'
    }else if(password.trim().length < 8 || password.trim().length > 128){
        error.password = 'Password should be between 8 to 128 charcter'
    }
    
    if(Object.keys(error).length > 0){
        setClientError(error);
    }else{
        setClientError({})
        const formdata = {
            name: name,
            email: email,
            password: password
        }
        try{
            await axios.post('/register',formdata)
            alert('Registered successfully. You can login now.');
            navigate('/');
        }catch(err){
            const errors = err.response?.data?.errors;
            if (Array.isArray(errors) && errors.length > 0) {
                setServerError(errors[0].msg); // Show first validation error
                alert(serverError);
              } else {
                setServerError('Registration failed. Please try again.');
                alert(serverError);
              }
        }        

    }
    
  }

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/basketball-background/basketball-court-22261472.webp')] bg-cover bg-center">
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-black bg-opacity-60"></div>

  {/* Form content with existing styles */}
  <div className="relative z-10 flex items-center justify-center min-h-screen">
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-10 rounded-2xl shadow-xl w-96 border-4 border-orange-500 bg-opacity-95 backdrop-blur-md"
    >
      <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-6 tracking-wider">
        Fantasy Hoops Signup
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="text-sm text-red-500 mb-3">{clientError.name}</p>

      <input
        type="text"
        placeholder="Email"
        className="w-full p-3 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p className="text-sm text-red-500 mb-3">{clientError.email}</p>

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p className="text-sm text-red-500 mb-4">{clientError.password}</p>

      <button 
        type="submit" 
        className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition-all font-semibold shadow-md"
      >
        Register
      </button>

      <p className="text-sm mt-5 text-center text-gray-700">
        Already have an account? <Link to="/" className="text-blue-600 font-medium hover:underline">Login</Link>
      </p>
    </form>
  </div>
</div>


  );
}
