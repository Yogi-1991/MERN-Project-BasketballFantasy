// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from '../config/axios';

// // export default function EditTeam() {
// //   const { teamId } = useParams();
// //   const navigate = useNavigate();

// //   const [teamData, setTeamData] = useState(null);
// //   const [leagues, setLeagues] = useState([]);
// //   const [seasons, setSeasons] = useState([]);
// //   const [logoImage, setLogoImage] = useState(null);

// //   useEffect(() => {
// //     (async () => {
// //       const [teamRes, leaguesRes, seasonsRes] = await Promise.all([
// //         axios.get(`/data-entry/teams/${teamId}`, {
// //           headers: { Authorization: localStorage.getItem('token') }
// //         }),
// //         axios.get('/admin/leagues', {
// //           headers: { Authorization: localStorage.getItem('token') }
// //         }),
// //         axios.get('/admin/seasons', {
// //           headers: { Authorization: localStorage.getItem('token') }
// //         })
// //       ]);

// //       setTeamData(teamRes.data);
// //       setLeagues(leaguesRes.data);
// //       setSeasons(seasonsRes.data);
// //     })();
// //   }, [teamId]);

// //   const handleChange = (field, value) => {
// //     setTeamData({ ...teamData, [field]: value });
// //   };

// //   const handleSeasonChange = (index, field, value) => {
// //     const updated = [...teamData.seasons];
// //     updated[index][field] = value;
// //     setTeamData({ ...teamData, seasons: updated });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const form = new FormData();

// //     form.append('teamName', teamData.teamName);
// //     form.append('homeCity', teamData.homeCity);
// //     form.append('leagueId', teamData.leagueId);
// //     form.append('seasons', JSON.stringify(teamData.seasons));
// //     if (logoImage) form.append('logoImage', logoImage);

// //     await axios.put(`/data-entry/teams/${teamId}`, form, {
// //       headers: {
// //         Authorization: localStorage.getItem('token'),
// //         'Content-Type': 'multipart/form-data'
// //       }
// //     });

// //     navigate('/data-entry/teams');
// //   };

// //   if (!teamData) return <div>Loading...</div>;

// //   return (
// //     <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
// //       <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Team</h2>

// //       <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
// //         <input
// //           type="text"
// //           placeholder="Team Name"
// //           value={teamData.teamName}
// //           onChange={(e) => handleChange('teamName', e.target.value)}
// //           className="w-full border p-2 rounded"
// //           required
// //         />

// //         <input
// //           type="text"
// //           placeholder="Home City"
// //           value={teamData.homeCity}
// //           onChange={(e) => handleChange('homeCity', e.target.value)}
// //           className="w-full border p-2 rounded"
// //           required
// //         />

// //         <select
// //           value={teamData.leagueId}
// //           onChange={(e) => handleChange('leagueId', e.target.value)}
// //           className="w-full border p-2 rounded"
// //           required
// //         >
// //           <option value="">Select League</option>
// //           {leagues.map((league) => (
// //             <option key={league._id} value={league._id}>{league.name}</option>
// //           ))}
// //         </select>

// //         <input
// //           type="file"
// //           onChange={(e) => setLogoImage(e.target.files[0])}
// //           className="w-full"
// //           accept="image/*"
// //         />

// //         <div className="mt-4">
// //           <h3 className="text-lg font-semibold text-gray-700">Seasons Info</h3>
// //           {teamData.seasons.map((season, index) => (
// //             <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
// //               <select
// //                 value={season.seasonYear}
// //                 onChange={(e) => handleSeasonChange(index, 'seasonYear', e.target.value)}
// //                 className="border p-2 rounded"
// //                 required
// //               >
// //                 <option value="">Select Season</option>
// //                 {seasons.map((s) => (
// //                   <option key={s._id} value={s._id}>{s.name}</option>
// //                 ))}
// //               </select>

// //               <input
// //                 type="text"
// //                 placeholder="Coach Name"
// //                 value={season.coachName}
// //                 onChange={(e) => handleSeasonChange(index, 'coachName', e.target.value)}
// //                 className="border p-2 rounded"
// //                 required
// //               />
// //             </div>
// //           ))}
// //         </div>

// //         <button
// //           type="submit"
// //           className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
// //         >
// //           Update Team
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from 'react';
// import axios from '../config/axios';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function EditTeam() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [teamName, setTeamName] = useState('');
//   const [homeCity, setHomeCity] = useState('');
//   const [logoImage, setLogoImage] = useState(null);
//   const [currentLogo, setCurrentLogo] = useState('');
//   const [leagueId, setLeagueId] = useState('');
//   const [seasons, setSeasons] = useState([]);
//   const [seasonData, setSeasonData] = useState([]);
//   const [leagues, setLeagues] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const [teamRes, leagueRes, seasonRes] = await Promise.all([
//         axios.get(`/data-entry/teams/${id}`, { headers: { Authorization: localStorage.getItem('token') } }),
//         axios.get('/admin/leagues', { headers: { Authorization: localStorage.getItem('token') } }),
//         axios.get('/admin/seasons', { headers: { Authorization: localStorage.getItem('token') } })
//       ]);

//       const team = teamRes.data;
//       setTeamName(team.teamName);
//       setHomeCity(team.homeCity);
//       setLeagueId(team.leagueId);
//       setCurrentLogo(team.logoImage);
//       setSeasonData(team.seasons);
//       setLeagues(leagueRes.data);
//       setSeasons(seasonRes.data);
//     };

//     fetchData();
//   }, [id]);

//   const handleSeasonChange = (index, field, value) => {
//     const updated = [...seasonData];
//     updated[index][field] = value;
//     setSeasonData(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append('teamName', teamName);
//     form.append('homeCity', homeCity);
//     form.append('leagueId', leagueId);
//     if (logoImage) form.append('logoImage', logoImage);
//     form.append('seasons', JSON.stringify(seasonData));

//     await axios.put(`/data-entry/teams/${id}`, form, {headers: {Authorization: localStorage.getItem('token')}});
//     navigate('/data-entry/teams');
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Team</h2>
//       <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//         <input
//           type="text"
//           placeholder="Team Name"
//           value={teamName}
//           onChange={(e) => setTeamName(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <input
//           type="text"
//           placeholder="Home City"
//           value={homeCity}
//           onChange={(e) => setHomeCity(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <select
//           value={leagueId}
//           onChange={(e) => setLeagueId(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         >
//           <option value="">Select League</option>
//           {leagues.map((league) => (
//             <option key={league._id} value={league._id}>{league.name}</option>
//           ))}
//         </select>

//         {currentLogo && (
//           <div>
//             <p className="text-sm text-gray-600">Current Logo:</p>
//             <img src={currentLogo} alt="Team Logo" className="w-20 h-20 object-cover" />
//           </div>
//         )}
//         <input
//           type="file"
//           onChange={(e) => setLogoImage(e.target.files[0])}
//           className="w-full"
//           accept="image/*"
//         />

//         <div className="mt-4">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Season Info</h3>
//           {seasonData.map((season, index) => (
//             <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <select
//                 value={season.seasonYear}
//                 onChange={(e) => handleSeasonChange(index, 'seasonYear', e.target.value)}
//                 className="border p-2 rounded"
//                 required
//               >
//                 <option value="">Select Season</option>
//                 {seasons.map((s) => (
//                   <option key={s._id} value={s._id}>{s.name}</option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 placeholder="Coach Name"
//                 value={season.coachName}
//                 onChange={(e) => handleSeasonChange(index, 'coachName', e.target.value)}
//                 className="border p-2 rounded"
//                 required
//               />
//             </div>
//           ))}
//         </div>

//         <button
//           type="submit"
//           className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
//         >
//           Update Team
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const teamRes = await axios.get(`/data-entry/teams/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setTeamData(teamRes.data);
      setLogoPreview(teamRes.data.logoImage);

      const leagueRes = await axios.get('/admin/leagues', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setLeagues(leagueRes.data);

      const seasonRes = await axios.get('/admin/seasons', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setSeasons(seasonRes.data);
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setTeamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamData((prev) => ({ ...prev, logoImage: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSeasonChange = (index, field, value) => {
    const updatedSeasons = [...teamData.seasons];
    updatedSeasons[index][field] = value;
    setTeamData((prev) => ({ ...prev, seasons: updatedSeasons }));
  };

  const addSeasonRow = () => {
    setTeamData((prev) => ({
      ...prev,
      seasons: [...prev.seasons, { seasonYear: '', coachName: '', players: [] }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('teamName', teamData.teamName);
    form.append('homeCity', teamData.homeCity);
    form.append('leagueId', teamData.leagueId);
    if (teamData.logoImage instanceof File) {
      form.append('logoImage', teamData.logoImage);
    }
    form.append('seasons', JSON.stringify(teamData.seasons));

    await axios.put(`/data-entry/teams/${id}`, form, {
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
      },
    });

    navigate('/data-entry/teams');
  };

  if (!teamData) return <p className="p-6">Loading team data...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Team</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          value={teamData.teamName}
          onChange={(e) => handleChange('teamName', e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Team Name"
          required
        />

        <input
          type="text"
          value={teamData.homeCity}
          onChange={(e) => handleChange('homeCity', e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Home City"
          required
        />

        <select
          value={teamData.leagueId}
          onChange={(e) => handleChange('leagueId', e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select League</option>
          {leagues.map((league) => (
            <option key={league._id} value={league._id}>
              {league.name}
            </option>
          ))}
        </select>

        <div>
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Team Logo"
              className="h-20 object-contain mb-2"
            />
          )}
          <input
            type="file"
            onChange={handleLogoChange}
            accept="image/*"
            className="w-full"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Seasons Info
          </h3>
          {teamData.seasons.map((season, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <select
                value={season.seasonYear}
                onChange={(e) =>
                  handleSeasonChange(index, 'seasonYear', e.target.value)
                }
                className="border p-2 rounded"
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={season.coachName}
                onChange={(e) =>
                  handleSeasonChange(index, 'coachName', e.target.value)
                }
                placeholder="Coach Name"
                className="border p-2 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSeasonRow}
            className="text-sm text-blue-600 underline"
          >
            + Add Another Season
          </button>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Update Team
        </button>
      </form>
    </div>
  );
}

