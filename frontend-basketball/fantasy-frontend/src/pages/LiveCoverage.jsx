
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function LiveCoverage() {
  const { matchId } = useParams();
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

  const [lineupExists, setLineupExists] = useState(false);
  const [statsExist, setStatsExist] = useState(false);

  // Fetch match details
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

  // Calculate total team scores from periods
  useEffect(() => {
    const totalHome = periodScores.reduce((acc, p) => acc + Number(p.homeScore || 0), 0);
    const totalAway = periodScores.reduce((acc, p) => acc + Number(p.awayScore || 0), 0);
    setHomeTeamScore(totalHome);
    setAwayTeamScore(totalAway);
  }, [periodScores]);

  // Checking if lineup exists
  useEffect(() => {
    const checkLineup = async () => {
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

  // Checking if match stats already exist
  useEffect(() => {
    const checkStats = async () => {
      try {
        const res = await axios.get(`/data-entry/match-stats/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setStatsExist(res.data.length > 0);
      } catch (err) {
        console.log("Stats check failed", err);
      }
    };
    checkStats();
  }, [matchId]);

  const handlePeriodChange = (index, field, value) => {
    const updated = [...periodScores];
    updated[index][field] = Number(value);
    setPeriodScores(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
    } catch (err) {
      console.log(err);
      alert(err.response.data.error || 'Failed to update live coverage');
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
        {/* Match status and attendance */}
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

        {/* Score summary */}
        <div className="flex justify-between items-center mt-4 mb-4">
          <div className="text-xl font-semibold text-gray-800">
            {match.homeTeam?.teamName}:{' '}
            <span className="text-3xl font-bold text-orange-700">{homeTeamScore}</span>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            <span className="text-3xl font-bold text-orange-700">{awayTeamScore}</span>
            : {match.awayTeam?.teamName}
          </div>
        </div>

        {/* Period scores */}
        <div>
          <h4 className="text-lg font-semibold mt-4 mb-2">Period Scores</h4>
          {periodScores.map((period, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-2">
              <input
                type="text"
                value={period.periodLabel}
                readOnly
                className="border p-2 rounded bg-gray-100 text-gray-600"
              />
              <input
                type="number"
                value={period.homeScore}
                onChange={(e) => handlePeriodChange(idx, 'homeScore', e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={period.awayScore}
                onChange={(e) => handlePeriodChange(idx, 'awayScore', e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
        <button type="button"
                className="text-blue-600 text-sm mt-2"
                onClick={() => {
                const otCount = periodScores.filter(p => p.periodLabel.startsWith('OT')).length + 1;
                setPeriodScores([...periodScores, {
                    periodLabel: `OT${otCount}`,
                    homeScore: 0,
                    awayScore: 0,
                }]);
                }}
            >
                + Add Overtime
        </button>

        <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
            Update Live Coverage
        </button>
        </div>
      </form>

      {/* Lineup and Stats Navigation */}
      <div className="mt-8 border-t pt-6">
        <h4 className="text-lg font-semibold mb-2">Lineup Management</h4>
        {lineupExists ? (
          <div className="flex gap-4 flex-wrap">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => navigate(`/data-entry/lineups/add/${matchId}`)}
            >
              Edit Lineups
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => navigate(statsExist ? `/data-entry/match-stats/edit/${matchId}` : `/data-entry/match-stats/${matchId}`)}
                >
              {statsExist ? 'Edit Match Stats' : 'Continue to Match Stats'}
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
