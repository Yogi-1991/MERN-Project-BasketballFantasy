import { Route,Routes } from 'react-router-dom';
import {  useEffect } from 'react';
import { ToastContainer } from 'react-toastify';//
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import {fetchUserdetails} from './slices/userSlice';
import { useDispatch } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const dispatch = useDispatch();

useEffect(()=>{ 
  if(localStorage.getItem('token')){
    dispatch(fetchUserdetails());
  }
},[])

  return (
    <>
    <Routes>
      <Route path="/" element={<Login/>}/>  
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={
        <PrivateRoute>
          <Account/>
        </PrivateRoute>
        }/>
      <Route path="/dashboard" element={
          <PrivateRoute>
              <Dashboard />
          </PrivateRoute>
          } />
    </Routes>
    <ToastContainer position="top-center" autoClose={2000} />
    </>
    
  )
}

export default App
