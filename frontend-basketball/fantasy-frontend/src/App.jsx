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
import AddPlayer from './pages/AddPlayer';
import ViewPlayers from './pages/ViewPlayers';
import EditPlayer from './pages/EditPlayer';
import ManageSchedule from './pages/ManageSchedule';
import CreateSchedule from './pages/CreateSchedule';
import EditSchedule from './pages/EditSchedule';
import ManageLivePage from './pages/ManageLivePage';
import LiveCoverage from './pages/LiveCoverage';
import LineupAddPage from './pages/LineupAddPage';

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

  <Route path="/data-entry/leagues" 
        element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><ManageLeagues /></ProtectedRoute>} 
  />
  <Route path="/data-entry/leagues/create" 
      element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><CreateLeague /></ProtectedRoute>}
   />
  <Route path="/data-entry/leagues/edit/:id" 
        element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><EditLeague /></ProtectedRoute>} 
    />
  <Route path="/data-entry/seasons" 
      element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><ManageSeasons/></ProtectedRoute>} 
    />
  <Route path="/data-entry/seasons/create" 
      element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><CreateSeason/></ProtectedRoute>} 
    /> 
  <Route path="/data-entry/seasons/edit/:id" 
      element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><EditSeason/></ProtectedRoute>} 
    />  

  <Route  path="/data-entry/teams"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><ManageTeams/></ProtectedRoute>}
  />
  <Route  path="/data-entry/teams/create"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><CreateTeam/> </ProtectedRoute>}
  />
  <Route  path="/data-entry/teams/edit/:id"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><EditTeam/> </ProtectedRoute>}
  />
  <Route  path="/data-entry/players/add/:teamId/:seasonId"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><AddPlayer/> </ProtectedRoute>}
  />
  <Route  path="/data-entry/players/view/:teamId/:seasonId"
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><ViewPlayers/> </ProtectedRoute>}
  />
 <Route  path="/data-entry/player/edit/:playerId" 
          element={<ProtectedRoute roles={['dataentry']} requiredTasks={['teams']}><EditPlayer/> </ProtectedRoute>}
  />
  
  {/* <Route
    path="/data-entry/players"
    element={
      <ProtectedRoute roles={['dataentry']} requiredTasks={['players']}>
        <div>Enter Players Page</div>
      </ProtectedRoute>
    }
  /> */}
  <Route
    path="/data-entry/schedules"
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><ManageSchedule/></ProtectedRoute>}
  />
  <Route
    path="/data-entry/schedules/create"
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><CreateSchedule/></ProtectedRoute>}
  />

  <Route
    path="/data-entry/schedules/edit/:matchId"
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><EditSchedule/></ProtectedRoute>}
  />

{/* <Route
    path="/data-entry/schedule/live/"
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><ManageLivePage/></ProtectedRoute>}
  /> */}

<Route
    path="/data-entry/schedule/live-coverage/" 
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><ManageLivePage/></ProtectedRoute>}
  />


  <Route
    path="/data-entry/live-coverage/:matchId"
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><LiveCoverage/></ProtectedRoute>}
  />

  <Route
    path="/data-entry/lineups/add/:matchId"
    element={<ProtectedRoute roles={['dataentry']} requiredTasks={['schedule']}><LineupAddPage/></ProtectedRoute>}
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
