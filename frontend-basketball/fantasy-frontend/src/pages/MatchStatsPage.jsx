// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from '../config/axios';

// export default function MatchStatsPage() {
//   const { matchId } = useParams();
//   const navigate = useNavigate();

//   const [match, setMatch] = useState(null);
//   const [players, setPlayers] = useState([]); // All lineup players
//   const [existingStats, setExistingStats] = useState({}); // Map by playerId

//   const [stats, setStats] = useState({}); // form state

//   // Fetch match and lineup players
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const matchRes = await axios.get(`/data-entry/schedules/${matchId}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });
//         setMatch(matchRes.data);

//         const lineupRes = await axios.get(`/data-entry/lineups/check/${matchId}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });

//         const allPlayers = [
//           ...lineupRes.data.teamHome.starters,
//           ...lineupRes.data.teamHome.substitutions,
//           ...lineupRes.data.teamAway.starters,
//           ...lineupRes.data.teamAway.substitutions,
//         ];

//         setPlayers(allPlayers);

//         const statRes = await axios.get(`/data-entry/match-stats/${matchId}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });

//         const statMap = {};
//         for (const stat of statRes.data) {
//           statMap[stat.playerId._id] = stat;
//         }
//         setExistingStats(statMap);

//         // Set initial state for inputs
//         const initialStats = {};
//         for (const p of allPlayers) {
//           const id = typeof p.player === 'object' ? p.player._id : p.player;
//           const existing = statMap[id];
//           initialStats[id] = existing?.stats || {
//             points: 0,
//             rebounds: 0,
//             assists: 0,
//             steals: 0,
//             blocks: 0,
//             fouls: 0,
//             minutesPlayed: 0,
//           };
//         }
//         setStats(initialStats);
//       } catch (err) {
//         console.error(err);
//         alert('Failed to load stats page');
//       }
//     };
//     fetchData();
//   }, [matchId]);

//   const handleStatChange = (playerId, field, value) => {
//     setStats((prev) => ({
//       ...prev,
//       [playerId]: {
//         ...prev[playerId],
//         [field]: Number(value),
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = players.map((p) => {
//       const playerId = typeof p.player === 'object' ? p.player._id : p.player;
//       const teamId = typeof p.team === 'object' ? p.team._id : p.team;
//       return {
//         gameId: matchId,
//         playerId,
//         teamId,
//         stats: stats[playerId],
//       };
//     });

//     try {
//       await axios.post('/data-entry/match-stats', { stats: payload }, {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       alert('Stats saved successfully');
//       navigate(`/data-entry/live-coverage/${matchId}`);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save stats');
//     }
//   };

//   if (!match) return <p className="p-6">Loading match and players...</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
//       <h2 className="text-2xl font-bold text-orange-600 mb-4">Match Stats Entry</h2>
//       <h4 className="text-lg font-semibold text-gray-800 mb-6">
//         {match.homeTeam?.teamName} vs {match.awayTeam?.teamName}
//       </h4>

//       <form onSubmit={handleSubmit}>
//         {players.map((p, idx) => {
//           const player = typeof p.player === 'object' ? p.player : p;
//           const playerId = typeof p.player === 'object' ? p.player._id : p.player;
//           return (
//             <div key={playerId} className="mb-6 border-b pb-4">
//               <h4 className="font-semibold text-gray-700 mb-2">
//                 {player?.firstName} {player?.lastName || ''}
//               </h4>
//               <div className="grid grid-cols-4 gap-4">
//                 {['points', 'rebounds', 'assists', 'steals', 'blocks', 'fouls', 'minutesPlayed'].map((field) => (
//                   <div key={field}>
//                     <label className="block text-sm text-gray-600 mb-1 capitalize">{field}</label>
//                     <input
//                       type="number"
//                       value={stats[playerId]?.[field] || 0}
//                       onChange={(e) => handleStatChange(playerId, field, e.target.value)}
//                       className="w-full border p-2 rounded"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//         <button
//           type="submit"
//           className="mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
//         >
//           Save Stats
//         </button>
//       </form>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function MatchStatsPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState({ home: [], away: [] }); // Grouped by team
  const [existingStats, setExistingStats] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchRes = await axios.get(`/data-entry/schedules/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setMatch(matchRes.data);

        const lineupRes = await axios.get(`/data-entry/lineups/check/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });

        const allPlayers = [
          ...lineupRes.data.teamHome.starters.map(p => ({ ...p, team: lineupRes.data.teamHome.team })),
          ...lineupRes.data.teamHome.substitutions.map(p => ({ ...p, team: lineupRes.data.teamHome.team })),
          ...lineupRes.data.teamAway.starters.map(p => ({ ...p, team: lineupRes.data.teamAway.team })),
          ...lineupRes.data.teamAway.substitutions.map(p => ({ ...p, team: lineupRes.data.teamAway.team })),
        ];

        const homePlayers = [];
        const awayPlayers = [];

        for (const p of allPlayers) {
          const teamId = typeof p.team === 'object' ? p.team._id : p.team;
          if (teamId === matchRes.data.homeTeam._id) {
            homePlayers.push(p);
          } else {
            awayPlayers.push(p);
          }
        }

        setPlayers({ home: homePlayers, away: awayPlayers });

        const statRes = await axios.get(`/data-entry/match-stats/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });

        const statMap = {};
        for (const stat of statRes.data) {
          statMap[stat.playerId._id] = stat;
        }
        setExistingStats(statMap);

        const initialStats = {};
        for (const p of allPlayers) {
          const id = typeof p.player === 'object' ? p.player._id : p.player;
          const existing = statMap[id];
          initialStats[id] = existing?.stats || {
            points: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            fouls: 0,
            minutesPlayed: 0,
          };
        }
        setStats(initialStats);
      } catch (err) {
        console.error(err);
        alert('Failed to load stats page');
      }
    };
    fetchData();
  }, [matchId]);

  const handleStatChange = (playerId, field, value) => {
    setStats((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: Number(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = [...players.home, ...players.away].map((p) => {
      const playerId = typeof p.player === 'object' ? p.player._id : p.player;
      const teamId = typeof p.team === 'object' ? p.team._id : p.team;
      return {
        gameId: matchId,
        playerId,
        teamId,
        stats: stats[playerId],
      };
    });

    try {
      await axios.post('/data-entry/match-stats', { stats: payload }, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert('Stats saved successfully');
      navigate(`/data-entry/live-coverage/${matchId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save stats');
    }
  };

  if (!match) return <p className="p-6">Loading match and players...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Match Stats Entry</h2>
      <h4 className="text-lg font-semibold text-gray-800 mb-6">
        {match.homeTeam?.teamName} vs {match.awayTeam?.teamName}
      </h4>

      <form onSubmit={handleSubmit}>
        {['home', 'away'].map((side) => (
          <div key={side} className="mb-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {side === 'home' ? match.homeTeam?.teamName : match.awayTeam?.teamName}
            </h3>

            {players[side].map((p) => {
              const player = typeof p.player === 'object' ? p.player : p;
              const playerId = typeof p.player === 'object' ? p.player._id : p.player;

              return (
                <div key={playerId} className="mb-6 border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {player?.firstName} {player?.lastName || ''}
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    {['points', 'rebounds', 'assists', 'steals', 'blocks', 'fouls', 'minutesPlayed'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm text-gray-600 mb-1 capitalize">{field}</label>
                        <input
                          type="number"
                          value={stats[playerId]?.[field] || 0}
                          onChange={(e) => handleStatChange(playerId, field, e.target.value)}
                          className="w-full border p-2 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Save Stats
        </button>
      </form>
    </div>
  );
}
