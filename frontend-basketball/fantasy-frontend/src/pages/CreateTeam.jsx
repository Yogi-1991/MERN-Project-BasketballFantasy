

import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [leagueId, setLeagueId] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const [coachName, setCoachName] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [clientError, setClientError] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaguesSeasons = async () => {
      const [leagueRes, seasonRes] = await Promise.all([
        axios.get('/data-entry/leagues', {
          headers: { Authorization: localStorage.getItem('token') },
        }),
        axios.get('/data-entry/seasons', {
          headers: { Authorization: localStorage.getItem('token') },
        }),
      ]);
      setLeagues(leagueRes.data);
      setSeasons(seasonRes.data);
    };
    fetchLeaguesSeasons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = {};
    
    if(teamName.trim() === ''){
    error.teamName ='teamName field is empty'
    }
    if(homeCity.trim() === ''){
    error.homeCity ='homeCity field is empty'
     }
    if(coachName.trim() === ''){
     error.coachName ='coachName field is empty'
     }
            
                
    if(Object.keys(error).length > 0){
        setClientError(error);
    }else{
        setClientError({})
        const form = new FormData();
        form.append('teamName', teamName);
        form.append('homeCity', homeCity);
        form.append('leagueId', leagueId);
        if (logoImage) form.append('logoImage', logoImage);
        form.append('seasons', JSON.stringify([{ seasonYear, coachName }]));
        try{
            await axios.post('/data-entry/teams', form, {headers: {Authorization: localStorage.getItem('token')}}); 
        navigate('/data-entry/teams');
        }catch(err){
            console.log(err)
            alert(err.response.data.error)
        }
        
         }

    

   
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Add New Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border p-2 rounded"          
        />
        <p className="text-sm text-red-500 mb-3">{clientError.teamName}</p>

        <input
          type="text"
          placeholder="Home City"
          value={homeCity}
          onChange={(e) => setHomeCity(e.target.value)}
          className="w-full border p-2 rounded"
          
        />
            <p className="text-sm text-red-500 mb-3">{clientError.homeCity}</p>

        <select
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
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
          accept="image/*"
          onChange={(e) => setLogoImage(e.target.files[0])}
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={seasonYear}
            onChange={(e) => setSeasonYear(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Season</option>
            {seasons.map((season) => (
              <option key={season._id} value={season._id}>{season.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Coach Name"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            className="border p-2 rounded"
            
          />
         <p className="text-sm text-red-500 mb-3">{clientError.coachName}</p>

        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Create Team
        </button>
      </form>
    </div>
  );
}
