import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function EditTeam() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    (async () => {
      const [teamRes, leaguesRes, seasonsRes] = await Promise.all([
        axios.get(`/data-entry/teams/${teamId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        }),
        axios.get('/admin/leagues', {
          headers: { Authorization: localStorage.getItem('token') }
        }),
        axios.get('/admin/seasons', {
          headers: { Authorization: localStorage.getItem('token') }
        })
      ]);

      setTeamData(teamRes.data);
      setLeagues(leaguesRes.data);
      setSeasons(seasonsRes.data);
    })();
  }, [teamId]);

  const handleChange = (field, value) => {
    setTeamData({ ...teamData, [field]: value });
  };

  const handleSeasonChange = (index, field, value) => {
    const updated = [...teamData.seasons];
    updated[index][field] = value;
    setTeamData({ ...teamData, seasons: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append('teamName', teamData.teamName);
    form.append('homeCity', teamData.homeCity);
    form.append('leagueId', teamData.leagueId);
    form.append('seasons', JSON.stringify(teamData.seasons));
    if (logoImage) form.append('logoImage', logoImage);

    await axios.put(`/data-entry/teams/${teamId}`, form, {
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      }
    });

    navigate('/data-entry/teams');
  };

  if (!teamData) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Team</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Team Name"
          value={teamData.teamName}
          onChange={(e) => handleChange('teamName', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Home City"
          value={teamData.homeCity}
          onChange={(e) => handleChange('homeCity', e.target.value)}
          className="w-full border p-2 rounded"
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
            <option key={league._id} value={league._id}>{league.name}</option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setLogoImage(e.target.files[0])}
          className="w-full"
          accept="image/*"
        />

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700">Seasons Info</h3>
          {teamData.seasons.map((season, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <select
                value={season.seasonYear}
                onChange={(e) => handleSeasonChange(index, 'seasonYear', e.target.value)}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Coach Name"
                value={season.coachName}
                onChange={(e) => handleSeasonChange(index, 'coachName', e.target.value)}
                className="border p-2 rounded"
                required
              />
            </div>
          ))}
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
