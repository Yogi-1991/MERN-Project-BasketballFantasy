import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function LiveCoverage() {
  const { matchId } = useParams(); // Schedule ID
const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [status, setStatus] = useState('in-progress');
  const [attendance, setAttendance] = useState(0);
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [awayTeamScore, setAwayTeamScore] = useState(0);
  const [periodScores, setPeriodScores] = useState([
    { periodLabel: 'Q1', homeScore: 0, awayScore: 0 },
    { periodLabel: 'Q2', homeScore: 0, awayScore: 0 },
    { periodLabel: 'Q3', homeScore: 0, awayScore: 0 },
    { periodLabel: 'Q4', homeScore: 0, awayScore: 0 },
  ]);

  useEffect(() => {
    const fetchMatch = async () => {
      const res = await axios.get(`/data-entry/schedules/${matchId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      const data = res.data;
      setMatch(data);
      setStatus(data.status);
      setAttendance(data.attendance);
      setHomeTeamScore(data.homeTeamScore);
      setAwayTeamScore(data.awayTeamScore);
      setPeriodScores(data.periodScores?.length ? data.periodScores : periodScores);
    };

    fetchMatch();
  }, [matchId]);

  useEffect(() => {
  const totalHome = periodScores.reduce((acc, p) => acc + Number(p.homeScore || 0), 0);
  const totalAway = periodScores.reduce((acc, p) => acc + Number(p.awayScore || 0), 0);
  setHomeTeamScore(totalHome);
  setAwayTeamScore(totalAway);
}, [periodScores]);

const [lineupExists, setLineupExists] = useState(false);

useEffect(() => {
  const checkLineup = async () => {
    console.log("matchId",matchId)
    try {
      const res = await axios.get(`/data-entry/lineups/check/${matchId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setLineupExists(res.data);
    } catch (err) {
      console.log("Lineup check failed", err);
    }
  };
  checkLineup();
}, [matchId]);

  const handlePeriodChange = (index, field, value) => {
    const updated = [...periodScores];
    updated[index][field] = Number(value);
    setPeriodScores(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        await axios.put(
      `/data-entry/updateLive/${matchId}`,
      {
        status,
        attendance,
        homeTeamScore,
        awayTeamScore,
        periodScores,
      },
      {
        headers: { Authorization: localStorage.getItem('token') },
      }
    );
    alert('Live coverage updated!');    
    }catch(err){
      console.log(err)
      alert(err.response.data.error)
    }
    
  };

  if (!match) return <p className="p-6">Loading match info...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Live Coverage</h2>
      <h3 className="mb-2 text-lg font-semibold text-gray-700">
        {match.homeTeam?.teamName} vs {match.awayTeam?.teamName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
  {/* Status and Attendance */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Match Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded w-full">
        <option value="pre-game">Pre-Game</option>
        <option value="in-progress">In Progress</option>
        <option value="final">Final</option>
        <option value="postponed">Postponed</option>
        <option value="canceled">Canceled</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Attendance</label>
      <input
        type="number"
        value={attendance}
        onChange={(e) => setAttendance(Number(e.target.value))}
        className="border p-2 rounded w-full"
        placeholder="Attendance"
      />
    </div>
  </div>

  {/* Team Scores */}
  <div className="flex justify-between items-center mt-4 mb-4">
  <div className="text-xl font-semibold text-gray-800">
    {match.homeTeam?.teamName}:{' '}
    <span className="text-3xl font-bold text-orange-700">{homeTeamScore}</span>
  </div>
  <div className="text-xl font-semibold text-gray-800">
    
    <span className="text-3xl font-bold text-orange-700">{awayTeamScore}</span>
    :{' '} {match.awayTeam?.teamName}
  </div>
</div>

  {/* Period Scores */}
  <div>
   <h4 className="text-lg font-semibold mt-4 mb-2">Period Scores</h4>
{periodScores.map((period, idx) => (
  <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
    <input
      type="text"
      value={period.periodLabel}
      readOnly
      className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
    />
    <input
      type="number"
      value={period.homeScore}
      onChange={(e) => handlePeriodChange(idx, 'homeScore', e.target.value)}
      className="border p-2 rounded"
      placeholder={`${match.homeTeam?.teamName} Score`}
    />
    <input
      type="number"
      value={period.awayScore}
      onChange={(e) => handlePeriodChange(idx, 'awayScore', e.target.value)}
      className="border p-2 rounded"
      placeholder={`${match.awayTeam?.teamName} Score`}
    />
  </div>
))}
  </div>

  <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
    Update Live Coverage
  </button>
</form>
<div className="mt-8 border-t pt-6">
  <h4 className="text-lg font-semibold mb-2">Lineup Management</h4>
  {lineupExists ? (
    <div className="flex gap-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => navigate(`/data-entry/lineups/add/${matchId}`)}
      >
        Edit Lineups
      </button>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate(`/data-entry/stats/add/${matchId}`)}
      >
        Continue to Match Stats
      </button>
    </div>
  ) : (
    <button
      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      onClick={() => navigate(`/data-entry/lineups/add/${matchId}`)}
    >
      Add Lineups
    </button>
  )}
</div>
    </div>    
  );
}
