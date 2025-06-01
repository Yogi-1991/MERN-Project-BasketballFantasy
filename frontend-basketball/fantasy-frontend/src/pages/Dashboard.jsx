import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate,Link} from "react-router-dom";
import {scheduleUpcoming} from '../slices/scheduleSlice';
import { getUserContests } from "../slices/contestsSlice";

export default function Dashboard() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {userData} = useSelector((state)=>{
      return state.user;
  });

  const {scheduleData,loading} = useSelector((state)=>{
    return state.schedule
  });
  const {contestsData,loading:contestLoading,} = useSelector((state)=>{
      return state.contest
  })

  useEffect(()=>{
    dispatch(scheduleUpcoming());
    dispatch(getUserContests());
  },[dispatch]);

  const today = new Date().toLocaleDateString('en-CA');

   const todaysMatches = scheduleData.filter((match) => {
    const matchDate = new Date(match.matchDate).toLocaleDateString('en-CA');
    console.log(matchDate,"compare",today)
    return matchDate === today;

  });
  


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">Welcome, {userData.name || Player}!</h1>
      <p className="text-gray-600">Get ready to build your dream basketball fantasy team.</p>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">   
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <h2 className="text-lg font-semibold text-gray-700">Wallet Balance</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">₹{userData.wallet.balance || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <h2 className="text-lg font-semibold text-gray-700">Upcoming Matches</h2>
          <p className="text-2xl mt-2 text-blue-600">{loading ? 'Loading...': `${todaysMatches.length} matches today`}</p>
          <Link to="/matches" className="text-blue-600 hover:underline float-right"> View All</Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <h2 className="text-lg font-semibold text-gray-700">My Contests</h2>
          <p className="text-2xl mt-2 text-purple-600">{contestLoading ? 'Loading...' : `${contestsData.length} active`}</p>
          <button onClick={() => navigate("/my-contests")} className="mt-4 text-sm text-orange-600 underline hover:text-orange-800">
            View All
          </button>
        </div>
      </div>

 
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 rounded-xl shadow-lg mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Build Your Fantasy Team Now</h2>
        <p className="mb-4">Join contests and win exciting rewards!</p>
        <button className="bg-white text-orange-600 font-bold px-6 py-2 rounded hover:bg-orange-100 transition">
          Create Team
        </button>
      </div>
    </div>
  );
}


// export default function Dashboard() {
    
   
//     const {data, isLoggedIn} = useSelector((state)=>{
//         console.log("called Slice")
//         return state.user
//    });
//    console.log("slice data",data)
// //    if(!data){
// //     return false
// //    }
//    const dispatch = useDispatch();
//    const navigate = useNavigate();  


//     const handleLogout = ()=>{
//         localStorage.removeItem('token');
//         dispatch(logout());
//         toast.success('Logged out successfully 👋');
//         navigate('/'); 
//      }
     
//     return (
//         <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 to-orange-300">
//         <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-xl text-center border-4 border-orange-500">
//         {isLoggedIn?<>
//         <h2 className="text-3xl font-extrabold mb-4 text-orange-600 tracking-wider">
//           Welcome {data?.name || "User"}!
//           </h2>
//           <p className="text-sm text-gray-500 mb-6">{data?.email}</p>
//           <p className="text-gray-700 mb-6 text-lg">
//             You're now login. Draft your dream team and compete to be the best!
//           </p>
  
//           <button
//             onClick={handleLogout}
//             className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition-all font-semibold"
//           >
//             Logout
//           </button>
//         </> :
//         <>
//         <p className="text-gray-700 mb-6 text-lg">
//             Please <a href='/'><b><span style={{"color":"red"}}>login</span></b></a> to Draft your dream team and compete to be the best!
            
//           </p>
//         </>}
        
          
//         </div>
//       </div>
//     );
//   }