import { Route,Routes } from 'react-router-dom';
import {  useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import MyTeam from './pages/MyTeam';
import Contests from './pages/Contests';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import {fetchUserdetails} from './slices/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import MyContests from './pages/MyContests';
import PrivateRoute from './components/PrivateRoute';
import ContestDetails from './pages/ContestDetails';
import UpcomingMatches from './pages/UpcomingMatches';
import SelectPlayers from './pages/SelectPlayers';
import TeamFoundMsg  from './pages/TeamFoundMsg';

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
      <Route path='/unauthorized' element={<Unauthorized/>}/>

      <Route element={<PrivateRoute><ProtectedRoute roles={['registered']}><Layout /></ProtectedRoute></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} /> 
       <Route path="/my-team" element={<MyTeam/>}/>
       <Route path="/contests" element={<Contests/>}/>
       <Route path="/my-contests" element={<MyContests/>}/>
       <Route path="/matches" element={<UpcomingMatches />}/>
       <Route path="/select-team/:gameId" element={<SelectPlayers />} />
       <Route path="/contest/:contestId" element={<ContestDetails/>}/>
       <Route path="/team-found" element={<TeamFoundMsg/>}/>

       

       </Route>
    </Routes>
    <ToastContainer position="top-center" autoClose={500} />
    </>
    
  )
}

export default App
