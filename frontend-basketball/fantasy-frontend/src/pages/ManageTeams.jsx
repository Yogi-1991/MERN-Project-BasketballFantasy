

// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from '../config/axios';

// export default function ManageTeams() {
//   const [teams, setTeams] = useState([]);
//   const [seasons, setSeasons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFormFor, setShowFormFor] = useState(null); // teamId for which form is open
//   const [formData, setFormData] = useState({ seasonYear: '', coachName: '' });

//   const navigate = useNavigate();

//   const fetchTeams = async () => {
//     try {
//       const res = await axios.get('/data-entry/teams', {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       setTeams(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchSeasons = async () => {
//     try {
//       const res = await axios.get('/admin/seasons', {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       setSeasons(res.data.filter((s) => s.isActive));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchTeams();
//     fetchSeasons();
//     setLoading(false);
//   }, []);

//   const handleAddSeason = async (teamId) => {
//     try {
//       await axios.put(
//         `/data-entry/teams/season/${teamId}`,
//         formData,
//         {
//           headers: { Authorization: localStorage.getItem('token') },
//         }
//       );
//       setShowFormFor(null);
//       setFormData({ seasonYear: '', coachName: '' });
//       fetchTeams(); // refresh list
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-orange-600">Teams</h2>
//         <Link
//           to="/data-entry/teams/create"
//           className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//         >
//           + Create Team
//         </Link>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="py-2 px-4 border">Logo</th>
//                 <th className="py-2 px-4 border">Team Name</th>
//                 <th className="py-2 px-4 border">Home City</th>
//                 <th className="py-2 px-4 border">League</th>
//                 <th className="py-2 px-4 border">Seasons</th>
//                 <th className="py-2 px-4 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teams.map((team) => {
//                 const hasActiveSeason = team.seasons.some((s) => s.seasonYear?.isActive);
//                 console.log(hasActiveSeason)
//                 return (
//                   <tr key={team._id} className="hover:bg-gray-50">
//                     <td className="py-2 px-4 border">
//                       {team.logoImage ? (
//                         <img
//                           src={`/${team.logoImage}`}
//                           alt="logo"
//                           className="w-10 h-10 object-contain"
//                         />
//                       ) : (
//                         'N/A'
//                       )}
//                     </td>
//                     <td className="py-2 px-4 border">{team.teamName}</td>
//                     <td className="py-2 px-4 border">{team.homeCity}</td>
//                     <td className="py-2 px-4 border">{team.leagueId?.name}</td>
//                     <td className="py-2 px-4 border">
//                       <ul className="list-disc pl-5">
//                         {team.seasons.map((s, i) => (
//                           <li key={i}>
//                             {s.seasonYear?.name} - Coach: {s.coachName}
//                           </li>
//                         ))}
//                       </ul>

//                       {!hasActiveSeason && (
//                         <>
//                           {showFormFor === team._id ? (
//                             <div className="mt-2 space-y-2">
//                               <select
//                                 className="border p-1 w-full"
//                                 value={formData.seasonYear}
//                                 onChange={(e) =>
//                                   setFormData({ ...formData, seasonYear: e.target.value })
//                                 }
//                               >
//                                 <option value="">Select Season</option>
//                                 {seasons.map((season) => (
//                                   <option key={season._id} value={season._id}>
//                                     {season.name}
//                                   </option>
//                                 ))}
//                               </select>

//                               <input
//                                 type="text"
//                                 placeholder="Coach Name"
//                                 className="border p-1 w-full"
//                                 value={formData.coachName}
//                                 onChange={(e) =>
//                                   setFormData({ ...formData, coachName: e.target.value })
//                                 }
//                               />
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleAddSeason(team._id)}
//                                   className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   onClick={() => setShowFormFor(null)}
//                                   className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <button
//                               onClick={() => setShowFormFor(team._id)}
//                               className="mt-2 text-blue-600 underline text-sm"
//                             >
//                               + Add Season
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </td>
//                     <td className="py-2 px-4 border">
//                       <button
//                         onClick={() => navigate(`/data-entry/teams/edit/${team._id}`)}
//                         className="text-blue-600 hover:underline mr-2"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from '../config/axios';

// export default function ManageTeams() {
//   const [teams, setTeams] = useState([]);
//   const navigate = useNavigate();

//   const fetchTeams = async () => {
//     const res = await axios.get('/data-entry/teams', {
//       headers: { Authorization: localStorage.getItem('token') }
//     });
//     setTeams(res.data);
//   };

//   useEffect(() => {
//     fetchTeams();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-orange-600">Manage Teams</h2>
//         <Link
//           to="/data-entry/teams/create"
//           className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//         >
//           + Create Team
//         </Link>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="py-2 px-4 border">Team Name</th>
//               <th className="py-2 px-4 border">City</th>
//               <th className="py-2 px-4 border">League</th>
//               <th className="py-2 px-4 border">Seasons</th>
//               <th className="py-2 px-4 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {teams.map(team => (
//               <tr key={team._id}>
//                 <td className="py-2 px-4 border">{team.teamName}</td>
//                 <td className="py-2 px-4 border">{team.homeCity}</td>
//                 <td className="py-2 px-4 border">{team.leagueId?.name}</td>
//                 <td className="py-2 px-4 border">
//                   <ul>
//                     {team.seasons.map((s, i) => (
//                       <li key={i} className="mb-1">

//                 <div className="text-sm font-medium text-gray-800">
//                   {s.seasonYear.name} - <span className="text-gray-600 italic">Coach: {s.coachName || 'N/A'}</span>
//                  </div>

//                         <button
//                           onClick={() =>
//                             navigate(`/data-entry/players/add/${team._id}/${s.seasonYear._id}`)
//                           }
//                           className="ml-2 text-sm text-blue-600 underline"
//                         >
//                           + Add Players
//                         </button>

//                         <button
//                           onClick={() =>
//                             navigate(`/data-entry/players/view/${team._id}/${s.seasonYear._id}`)
//                           }
//                           className="ml-2 text-sm text-green-600 underline"
//                         >
//                           View
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </td>
//                 <td className="py-2 px-4 border">
//                   <button
//                     onClick={() => navigate(`/data-entry/teams/edit/${team._id}`)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [seasonForm, setSeasonForm] = useState({ seasonYear: '', coachName: '' });
  const navigate = useNavigate();

  const fetchTeams = async () => {
    const res = await axios.get('/data-entry/teams', {
      headers: { Authorization: localStorage.getItem('token') },
    });
    setTeams(res.data);
  };

  const fetchSeasons = async () => {
    const res = await axios.get('/admin/seasons', {
      headers: { Authorization: localStorage.getItem('token') },
    });
    setSeasons(res.data);
  };

  useEffect(() => {
    fetchTeams();
    fetchSeasons();
  }, []);

  const handleAddSeason = async (teamId) => {
    if (!seasonForm.seasonYear || !seasonForm.coachName) return alert('All fields required');

    await axios.put(
      `/data-entry/teams/season/${teamId}`,
      { ...seasonForm },
      { headers: { Authorization: localStorage.getItem('token') } }
    );
    setSeasonForm({ seasonYear: '', coachName: '' });
    setExpandedTeamId(null);
    fetchTeams();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Teams</h2>
        <Link
          to="/data-entry/teams/create"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Create Team
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border">Logo</th>
              <th className="py-2 px-4 border">Team</th>
              <th className="py-2 px-4 border">Home City</th>
              <th className="py-2 px-4 border">League</th>
              <th className="py-2 px-4 border">Seasons</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const assignedSeasonIds = team.seasons.map((s) => s.seasonYear._id);
              const availableSeasons = seasons.filter(
                (s) => !assignedSeasonIds.includes(s._id)
              );
              const lastSeason = team.seasons[team.seasons.length - 1];
              const canAddSeason = !lastSeason || !lastSeason.seasonYear?.isActive;

              return (
                <tr key={team._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">
                    {team.logoImage ? (
                      <img src={`/${team.logoImage}`} alt="logo" className="w-10 h-10 object-contain" />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 border">{team.teamName}</td>
                  <td className="py-2 px-4 border">{team.homeCity}</td>
                  <td className="py-2 px-4 border">{team.leagueId?.name}</td>
                  <td className="py-2 px-4 border">
                    <ul className="space-y-2">
                      {team.seasons.map((s, i) => (
                        <li key={i}>
                          <div className="font-medium">
                            {s.seasonYear?.name || 'Unknown'}{' '}
                            <span className="text-sm italic text-gray-600">
                              (Coach: {s.coachName || 'N/A'})
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() =>
                                navigate(`/data-entry/players/add/${team._id}/${s.seasonYear._id}`)
                              }
                              className="text-sm text-blue-600 underline"
                            >
                              + Add Players
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/data-entry/players/view/${team._id}/${s.seasonYear._id}`)
                              }
                              className="text-sm text-green-600 underline"
                            >
                              View
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {canAddSeason && (
                      <div className="mt-2">
                        <button
                          className="text-sm text-orange-700 underline"
                          onClick={() => setExpandedTeamId(team._id)}
                        >
                          + Add Season
                        </button>
                        {expandedTeamId === team._id && (
                          <div className="mt-2 space-y-2">
                            <select
                              value={seasonForm.seasonYear}
                              onChange={(e) =>
                                setSeasonForm((prev) => ({ ...prev, seasonYear: e.target.value }))
                              }
                              className="w-full border p-2 rounded"
                            >
                              <option value="">Select Season</option>
                              {availableSeasons.map((s) => (
                                <option key={s._id} value={s._id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              value={seasonForm.coachName}
                              onChange={(e) =>
                                setSeasonForm((prev) => ({ ...prev, coachName: e.target.value }))
                              }
                              placeholder="Coach Name"
                              className="w-full border p-2 rounded"
                            />

                            <button
                              onClick={() => handleAddSeason(team._id)}
                              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                            >
                              Save Season
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => navigate(`/data-entry/teams/edit/${team._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
