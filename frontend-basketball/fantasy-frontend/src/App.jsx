import { Route,Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import PrivateRoute from './components/PrivateRoute';


function App() {

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
    </>
  )
}

export default App
