import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scheduleUpcoming } from '../slices/scheduleSlice';
import { useNavigate } from 'react-router-dom';

export default function Matches() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scheduleData, loading, serverError } = useSelector((state) => state.schedule);

  useEffect(() => {
    dispatch(scheduleUpcoming());
  }, [dispatch]);

  if (loading) return <p>Loading matches...</p>;
  if (serverError) return <p className="text-red-500">{serverError.error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Matches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduleData.map((match) => (
          <div
            key={match._id}
            onClick={() => navigate(`/matches/contests/${match._id}`)}
            className="bg-white shadow-md p-4 rounded cursor-pointer hover:bg-orange-50"
          >
            <p className="font-bold">
              {match.homeTeam.teamName} vs {match.awayTeam.teamName}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(match.matchDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}




// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {scheduleUpcoming} from '../slices/scheduleSlice';
// import { Link } from 'react-router-dom';

// export default function UpcomingMatches(){
//   const dispatch = useDispatch();

// const {scheduleData,loading,serverError} = useSelector((state)=>{
//     return state.schedule
//   });

//   useEffect(() => {
//     dispatch(scheduleUpcoming());
//   }, [dispatch]);

//   if (loading) {
//     return <p>Loading upcoming matches...</p>;
//   }
//   if (serverError) {
//     return <p className="text-red-500">{serverError.error}</p>;
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {scheduleData.map(match => (
//           <div key={match._id} className="bg-white shadow p-4 rounded">
//             <p className="font-bold">{match.homeTeam.teamName} vs {match.awayTeam.teamName}</p>
//             <p className="text-sm text-gray-600">{new Date(match.matchDate).toLocaleString()}</p>
//             <Link
//               to={`/select-team/${match._id}`}
//               className="inline-block mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
//             >
//               Create Team
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

