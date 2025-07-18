

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

// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from '../config/axios';

// export default function MatchStatsPage() {
//   const { matchId } = useParams();
//   const navigate = useNavigate();

//   const [match, setMatch] = useState(null);

//   // players grouped by side
//   const [players, setPlayers] = useState({ home: [], away: [] });

//   // existing stats keyed by playerId
//   const [existingStats, setExistingStats] = useState({});

//   // editable stat fields keyed by playerId
//   const [stats, setStats] = useState({});

//   // finalize toggle
//   const [isFinalized, setIsFinalized] = useState(false);

//   // loading guard
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Match
//         const matchRes = await axios.get(`/data-entry/schedules/${matchId}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });
//         setMatch(matchRes.data);

//         // 2. Lineups (all players in game)
//         const lineupRes = await axios.get(`/data-entry/lineups/check/${matchId}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });

//         const { teamHome, teamAway } = lineupRes.data;

//         // flatten lineup -> add team reference to each player object
//         const allPlayers = [
//           ...teamHome.starters.map((p) => ({ ...p, team: teamHome.team })),
//           ...teamHome.substitutions.map((p) => ({ ...p, team: teamHome.team })),
//           ...teamAway.starters.map((p) => ({ ...p, team: teamAway.team })),
//           ...teamAway.substitutions.map((p) => ({ ...p, team: teamAway.team })),
//         ];

//         // group into home / away using matchRes team ids
//         const homePlayers = [];
//         const awayPlayers = [];
//         for (const p of allPlayers) {
//           const teamId = typeof p.team === 'object' ? p.team._id : p.team;
//           if (teamId === matchRes.data.homeTeam._id) {
//             homePlayers.push(p);
//           } else {
//             awayPlayers.push(p);
//           }
//         }
//         setPlayers({ home: homePlayers, away: awayPlayers });

//         // 3. Existing match stats docs
//         const statRes = await axios.get(`/data-entry/match-stats/${matchId}`, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });

//         // map by playerId for quick lookup
//         const statMap = {};
//         let anyFinalized = false;
//         for (const stat of statRes.data) {
//           statMap[stat.playerId._id] = stat;
//           if (stat.isFinalized) anyFinalized = true;
//         }
//         setExistingStats(statMap);
//         setIsFinalized(anyFinalized); // pre-fill finalize toggle if previously finalized

//         // initial form values
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
//       } finally {
//         setLoading(false);
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

//     // If finalizing, warn user
//     if (isFinalized) {
//       const ok = window.confirm(
//         'Mark these stats as FINAL?\n\n' +
//         'This may trigger fantasy scoring & prize distribution and lock further edits. ' +
//         'You can still change later only through the Edit Stats workflow (if allowed).'
//       );
//       if (!ok) return;
//     }

//     // build payload from both teams
//     const payload = [...players.home, ...players.away].map((p) => {
//       const playerId = typeof p.player === 'object' ? p.player._id : p.player;
//       const teamId = typeof p.team === 'object' ? p.team._id : p.team;
//       return {
//         gameId: matchId,
//         playerId,
//         teamId,
//         stats: stats[playerId],
//         isFinalized, // send with each record (backend can fan-out or aggregate)
//       };
//     });

//     try {
//       await axios.post('/data-entry/match-stats', { stats: payload, isFinalized }, // top-level flag as convenience
//         { headers: { Authorization: localStorage.getItem('token') }}
//       );
//       alert(isFinalized ? 'Stats saved & finalized!' : 'Stats saved.');
//       navigate(`/data-entry/live-coverage/${matchId}`);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save stats');
//     }
//   };

//   if (loading) return <p className="p-6">Loading match and players...</p>;
//   if (!match) return <p className="p-6">Match not found.</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
//       <h2 className="text-2xl font-bold text-orange-600 mb-4">Match Stats Entry</h2>
//       <h4 className="text-lg font-semibold text-gray-800 mb-6">
//         {match.homeTeam?.teamName} vs {match.awayTeam?.teamName}
//       </h4>

//       {/* Finalize Toggle */}
//       <div className="mb-6 p-4 border rounded bg-yellow-50">
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isFinalized}
//             onChange={(e) => setIsFinalized(e.target.checked)}
//           />
//           <span className="font-semibold">Mark stats as FINAL</span>
//         </label>
//         <p className="text-sm text-yellow-800 mt-1">
//           When checked and saved, stats are locked for scoring & prize distribution.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {['home', 'away'].map((side) => (
//           <div key={side} className="mb-8">
//             <h3 className="text-xl font-bold text-gray-700 mb-4">
//               {side === 'home' ? match.homeTeam?.teamName : match.awayTeam?.teamName}
//             </h3>

//             {players[side].map((p) => {
//               const player = typeof p.player === 'object' ? p.player : p;
//               const playerId = typeof p.player === 'object' ? p.player._id : p.player;

//               return (
//                 <div key={playerId} className="mb-6 border-b pb-4">
//                   <h4 className="font-semibold text-gray-700 mb-2">
//                     {player?.firstName} {player?.lastName || ''}
//                   </h4>
//                   <div className="grid grid-cols-4 gap-4">
//                     {['points', 'rebounds', 'assists', 'steals', 'blocks', 'fouls', 'minutesPlayed'].map(
//                       (field) => (
//                         <div key={field}>
//                           <label className="block text-sm text-gray-600 mb-1 capitalize">
//                             {field}
//                           </label>
//                           <input
//                             type="number"
//                             value={stats[playerId]?.[field] ?? 0}
//                             onChange={(e) => handleStatChange(playerId, field, e.target.value)}
//                             className="w-full border p-2 rounded"
//                             disabled={isFinalized} // disable edits if already finalized (optional; remove if you want override)
//                           />
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
//         >
//           {isFinalized ? 'Save & Finalize Stats' : 'Save Stats'}
//         </button>
//       </form>
//     </div>
//   );
// }
