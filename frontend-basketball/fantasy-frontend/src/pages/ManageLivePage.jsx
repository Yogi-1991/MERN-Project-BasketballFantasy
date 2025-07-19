// import { useState, useEffect } from 'react';
// import axios from '../config/axios';
// import { useNavigate } from 'react-router-dom';

// export default function ManageLivePage() {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//   const fetchMatches = async () => {
//     try {
//       const res = await axios.get('/data-entry/schedule/live-coverage', {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       setMatches(res.data.filter(m => ['pre-game', 'in-progress'].includes(m.status)));
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to load matches.');
//       setLoading(false);
//     }
//   };

//   fetchMatches();
// }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-orange-600 mb-4">Live Matches</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : matches.length === 0 ? (
//         <p>No live matches available.</p>
//       ) : (
//         <ul className="space-y-2">
//           {matches.map(m => (
//             <li
//               key={m._id}
//               className="border rounded p-4 flex justify-between items-center hover:bg-gray-50"
//             >
//               <div>
//                 <strong>{new Date(m.matchDate).toLocaleString()}</strong> :{' '}
//                 {m.homeTeam?.teamName} vs {m.awayTeam?.teamName}
//               </div>
//               <button
//                 onClick={() => navigate(`/data-entry/live-coverage/${m._id}`)}
//                 className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//               >
//                 {m.status === 'pre-game' ? 'Start Live' : 'Continue Live'}
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function ManageLivePage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/data-entry/schedule/live-coverage', {
          headers: { Authorization: localStorage.getItem('token') },
        });

        const liveMatches = res.data.filter(m =>
          ['pre-game', 'in-progress'].includes(m.status)
        );
        setMatches(liveMatches);
        setFilteredMatches(liveMatches); // default show all
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Failed to load matches.');
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  //  Filter when selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setFilteredMatches(matches);
      return;
    }

    const selected = new Date(selectedDate);
    const filtered = matches.filter(m => {
      const matchDate = new Date(m.matchDate);
      return (
        matchDate.getFullYear() === selected.getFullYear() &&
        matchDate.getMonth() === selected.getMonth() &&
        matchDate.getDate() === selected.getDate()
      );
    });

    setFilteredMatches(filtered);
  }, [selectedDate, matches]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Live Matches</h2>

      {/* Date Filter */}
      <div className="mb-4 flex items-center space-x-2">
        <label className="font-semibold">Filter by Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate('')}
            className="text-blue-600 underline"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredMatches.length === 0 ? (
        <p>No matches found for the selected date.</p>
      ) : (
        <ul className="space-y-2">
          {filteredMatches.map(m => (
            <li
              key={m._id}
              className="border rounded p-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <strong>{new Date(m.matchDate).toLocaleString()}</strong> :{' '}
                {m.homeTeam?.teamName} vs {m.awayTeam?.teamName}
              </div>
              <button
                onClick={() => navigate(`/data-entry/live-coverage/${m._id}`)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                {m.status === 'pre-game' ? 'Start Live' : 'Continue Live'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
