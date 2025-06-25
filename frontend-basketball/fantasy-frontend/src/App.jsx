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
// import AdminLayout from './components/AdminLayout';
import {fetchUserdetails} from './slices/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import MyContests from './pages/MyContests';
import PrivateRoute from './components/PrivateRoute';
import ContestDetails from './pages/ContestDetails';
import UpcomingMatches from './pages/UpcomingMatches';
import SelectPlayers from './pages/SelectPlayers';
import TeamFoundMsg  from './pages/TeamFoundMsg';
import MatchContests from './pages/MatchContests';
import DataEntryList from './pages/DataEntryList';
import DataEntryCreate from './pages/DataEntryCreate';
import DataEntryEdit from  './pages/DataEntryEdit';
import ManageLeagues from './pages/ManageLeagues';
import CreateLeague from './pages/CreateLeague';
import EditLeague from './pages/EditLeague';
import ManageSeasons from './pages/ManageSeasons';
import CreateSeason from './pages/CreateSeason';
import EditSeason from './pages/EditSeason';
import ManageTeams from './pages/ManageTeams';
import CreateTeam from './pages/CreateTeam';
import EditTeam from './pages/EditTeam';


import AddWalletAmount from './pages/AddWalletAmount';
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from './stripe';


function App() {
  const dispatch = useDispatch();
  console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


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
       <Route path="/matches/contests/:gameId" element={<MatchContests />} />
       <Route path="/select-team/:gameId" element={<SelectPlayers />} />
       <Route path="/contest/:contestId" element={<ContestDetails/>}/>
       <Route path="/team-found" element={<TeamFoundMsg/>}/> 
       {/* <Route path="/add-wallet" element={<AddWalletAmount />} /> */}
       <Route  path="/add-wallet"  element={
            <Elements stripe={stripePromise}>
            <AddWalletAmount />
          </Elements>
        }/>      
     </Route>
  
    
      {/* Admin Routes */}
<Route
  element={
    <PrivateRoute>
      <ProtectedRoute roles={['admin']}>
        <Layout />
      </ProtectedRoute>
    </PrivateRoute>
  }
>
  <Route path="/admin/leagues" element={<ManageLeagues />} />
  <Route path="/admin/leagues/create" element={<CreateLeague />} />
  <Route path="/admin/leagues/edit/:id" element={<EditLeague />} />
  <Route path="/admin/seasons" element={<ManageSeasons/>} />
  <Route path="/admin/seasons/create" element={<CreateSeason/>} /> 
  <Route path="/admin/seasons/edit/:id" element={<EditSeason/>} />    
  <Route path="/admin/contests" element={<div>Manage Contests</div>} />
  <Route path="/admin/data-entry-list" element={<DataEntryList />} />
  <Route path="/admin/data-entry/create" element={<DataEntryCreate/>} />
  <Route path="/admin/data-entry/edit/:id" element={<DataEntryEdit/>} />

</Route>

{/* Data Entry Routes */}
<Route
  element={
    <PrivateRoute>
      <ProtectedRoute roles={['dataentry']}>
        <Layout />
      </ProtectedRoute>
    </PrivateRoute>
  }
>
  <Route  path="/data-entry/teams"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><ManageTeams/></ProtectedRoute>}
  />
  <Route  path="/data-entry/teams/create"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><CreateTeam/> </ProtectedRoute>}
  />
  <Route  path="/data-entry/teams/edit/:id"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><EditTeam/> </ProtectedRoute>}
  />

  <Route
    path="/data-entry/players"
    element={
      <ProtectedRoute roles={['dataentry']} requiredTasks={['players']}>
        <div>Enter Players Page</div>
      </ProtectedRoute>
    }
  />
  <Route
    path="/data-entry/schedule"
    element={
      <ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}>
        <div>Enter Schedule Page</div>
      </ProtectedRoute>
    }
  />
  <Route
    path="/data-entry/match-stats"
    element={
      <ProtectedRoute roles={['dataentry']} requiredTasks={['matchStats']}>
        <div>Enter Match Stats Page</div>
      </ProtectedRoute>
    }
  />
  <Route
    path="/data-entry/lineups"
    element={
      <ProtectedRoute roles={['dataentry']} requiredTasks={['lineup']}>
        <div>Enter Lineups Page</div>
      </ProtectedRoute>
    }
  />
</Route>
  </Routes>
<ToastContainer position="top-center" autoClose={500} />
    </>
    
  )
}

export default App
