// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../config/axios';

// export default function EditMatchStats() {
//   const { matchId } = useParams();
//   const [playersStats, setPlayersStats] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [lineupRes, statsRes] = await Promise.all([
//           axios.get(`/lineups/check-players/${matchId}`, {
//             headers: { Authorization: localStorage.getItem('token') },
//           }),
//           axios.get(`/data-entry/match-stats/${matchId}`, {
//             headers: { Authorization: localStorage.getItem('token') },
//           })
//         ]);

//         const lineupPlayers = lineupRes.data; // [{ playerId, fullName, teamId, teamName }]
//         const existingStats = statsRes.data;   // [{ playerId, stats, teamId }]

//         const merged = [];

//         // Build map of existing stats
//         const statsMap = new Map();
//         existingStats.forEach(s => statsMap.set(s.playerId, s));

//         // Merge with lineup players
//         lineupPlayers.forEach(p => {
//           merged.push({
//             ...p,
//             stats: statsMap.get(p.playerId)?.stats || {
//               points: 0, rebounds: 0, assists: 0, steals: 0,
//               blocks: 0, fouls: 0, minutesPlayed: 0,
//             },
//             isNew: !statsMap.has(p.playerId),
//             isMissingFromLineup: false,
//           });
//           statsMap.delete(p.playerId);
//         });

//         // Remaining in statsMap = no longer in lineup
//         statsMap.forEach((stat, playerId) => {
//           merged.push({
//             playerId,
//             fullName: `${stat.playerId.firstName} ${stat.playerId.lastName}`,
//             teamName: stat.teamId?.teamName,
//             teamId: stat.teamId?._id,
//             stats: stat.stats,
//             isNew: false,
//             isMissingFromLineup: true,
//           });
//         });

//         setPlayersStats(merged);
//       } catch (err) {
//         console.error('Failed to load stats data', err);
//       }
//     };
//     fetchData();
//   }, [matchId]);

//   const handleChange = (index, field, value) => {
//     const updated = [...playersStats];
//     updated[index].stats[field] = Number(value);
//     setPlayersStats(updated);
//   };

//   const handleSave = async (player) => {
//     try {
//       if (player.isNew) {
//         await axios.post('/data-entry/match-stats/edit', {
//           gameId: matchId,
//           playerId: player.playerId,
//           teamId: player.teamId,
//           stats: player.stats
//         }, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });
//       } else {
//         await axios.put(`/data-entry/match-stats/${matchId}/${player.playerId}`, {
//           stats: player.stats
//         }, {
//           headers: { Authorization: localStorage.getItem('token') },
//         });
//       }
//       alert('Saved successfully!');
//     } catch (err) {
//       console.error('Save failed', err);
//       alert('Save failed');
//     }
//   };

//   const handleDelete = async (playerId) => {
//     try {
//       await axios.delete(`/data-entry/match-stats/${matchId}/${playerId}`, {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       setPlayersStats(prev => prev.filter(p => p.playerId !== playerId));
//     } catch (err) {
//       console.error('Delete failed', err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Edit Match Stats</h2>
//       <table className="w-full table-auto text-sm border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Player</th>
//             <th className="p-2">Team</th>
//             <th className="p-2">Pts</th>
//             <th className="p-2">Reb</th>
//             <th className="p-2">Ast</th>
//             <th className="p-2">Stl</th>
//             <th className="p-2">Blk</th>
//             <th className="p-2">Fouls</th>
//             <th className="p-2">Min</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {playersStats.map((p, idx) => (
//             <tr key={p.playerId} className={p.isMissingFromLineup ? 'bg-red-100' : ''}>
//               <td className="p-2">{p.fullName}</td>
//               <td className="p-2">{p.teamName}</td>
//               {['points','rebounds','assists','steals','blocks','fouls','minutesPlayed'].map(field => (
//                 <td key={field} className="p-1">
//                   <input
//                     type="number"
//                     value={p.stats[field] || 0}
//                     onChange={(e) => handleChange(idx, field, e.target.value)}
//                     className="border px-1 py-0.5 w-14 text-center rounded"
//                   />
//                 </td>
//               ))}
//               <td className="p-2">
//                 <button
//                   onClick={() => handleSave(p)}
//                   className="bg-blue-600 text-white px-2 py-1 rounded mr-1"
//                 >Save</button>
//                 {p.isMissingFromLineup && (
//                   <button
//                     onClick={() => handleDelete(p.playerId)}
//                     className="bg-red-600 text-white px-2 py-1 rounded"
//                   >Delete</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';

export default function EditMatchStats() {
  const { matchId } = useParams();
  const [playersStats, setPlayersStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lineupRes, statsRes] = await Promise.all([
          axios.get(`/lineups/check-players/${matchId}`, {
            headers: { Authorization: localStorage.getItem('token') },
          }),
          axios.get(`/data-entry/match-stats/${matchId}`, {
            headers: { Authorization: localStorage.getItem('token') },
          }),
        ]);

        const lineupPlayers = lineupRes.data || []; // Expected: [{ playerId, fullName, teamId, teamName }]
        const existingStats = statsRes.data || [];   // Expected: [{ playerId: {_id, firstName, lastName}, teamId: {...}, stats: {...} }]

        const merged = [];
        const statsMap = new Map();

        // Step 1: Create a map of existing stats by playerId string
        existingStats.forEach(s => {
          const pid = s.playerId?._id?.toString?.();
          if (pid) statsMap.set(pid, s);
        });

        // Step 2: Combine lineup players with existing stats
        lineupPlayers.forEach(p => {
          const pid = p.playerId?.toString?.();
          const statEntry = statsMap.get(pid);
          merged.push({
            playerId: pid,
            fullName: p.fullName || `${statEntry?.playerId?.firstName || ''} ${statEntry?.playerId?.lastName || ''}`.trim(),
            teamId: p.teamId,
            teamName: p.teamName || statEntry?.teamId?.teamName,
            stats: statEntry?.stats || {
              points: 0, rebounds: 0, assists: 0, steals: 0,
              blocks: 0, fouls: 0, minutesPlayed: 0,
            },
            isNew: !statEntry,
            isMissingFromLineup: false,
          });
          statsMap.delete(pid); // remove from map
        });

        // Step 3: Add leftover stats that are no longer in lineup
        statsMap.forEach((stat, pid) => {
          merged.push({
            playerId: pid,
            fullName: `${stat.playerId?.firstName || ''} ${stat.playerId?.lastName || ''}`.trim(),
            teamId: stat.teamId?._id,
            teamName: stat.teamId?.teamName || '',
            stats: stat.stats,
            isNew: false,
            isMissingFromLineup: true,
          });
        });

        setPlayersStats(merged);
      } catch (err) {
        console.error('Failed to load stats data', err);
      }
    };

    fetchData();
  }, [matchId]);

  const handleChange = (index, field, value) => {
    const updated = [...playersStats];
    updated[index].stats[field] = Number(value);
    setPlayersStats(updated);
  };

  const handleSave = async (player) => {
    try {
      if (player.isNew) {
        await axios.post('/data-entry/match-stats/edit', {
          gameId: matchId,
          playerId: player.playerId,
          teamId: player.teamId,
          stats: player.stats
        }, {
          headers: { Authorization: localStorage.getItem('token') },
        });
      } else {
        await axios.put(`/data-entry/match-stats/${matchId}/${player.playerId}`, {
          stats: player.stats
        }, {
          headers: { Authorization: localStorage.getItem('token') },
        });
      }
      alert('Saved successfully!');
    } catch (err) {
      console.error('Save failed', err);
      alert('Save failed');
    }
  };

  const handleDelete = async (playerId) => {
    try {
      await axios.delete(`/data-entry/match-stats/${matchId}/${playerId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setPlayersStats(prev => prev.filter(p => p.playerId !== playerId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Match Stats</h2>
      <table className="w-full table-auto text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Player</th>
            <th className="p-2">Team</th>
            <th className="p-2">Pts</th>
            <th className="p-2">Reb</th>
            <th className="p-2">Ast</th>
            <th className="p-2">Stl</th>
            <th className="p-2">Blk</th>
            <th className="p-2">Fouls</th>
            <th className="p-2">Min</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {playersStats.map((p, idx) => (
            <tr key={`${p.playerId}-${idx}`} className={p.isMissingFromLineup ? 'bg-red-100' : ''}>
              <td className="p-2">{p.fullName || 'Unknown Player'}</td>
              <td className="p-2">{p.teamName || 'N/A'}</td>
              {['points', 'rebounds', 'assists', 'steals', 'blocks', 'fouls', 'minutesPlayed'].map(field => (
                <td key={field} className="p-1">
                  <input
                    type="number"
                    value={p.stats[field] ?? 0}
                    onChange={(e) => handleChange(idx, field, e.target.value)}
                    className="border px-1 py-0.5 w-14 text-center rounded"
                  />
                </td>
              ))}
              <td className="p-2">
                <button
                  onClick={() => handleSave(p)}
                  className="bg-blue-600 text-white px-2 py-1 rounded mr-1"
                >Save</button>
                {p.isMissingFromLineup && (
                  <button
                    onClick={() => handleDelete(p.playerId)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
