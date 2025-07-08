

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function LineupAddPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState({ home: [], away: [] });
  const [lineupId, setLineupId] = useState(null);
  const [lineup, setLineup] = useState({
    teamHome: { starters: [], substitutions: [] },
    teamAway: { starters: [], substitutions: [] },
  });

  const positionOptions = ['guard', 'forward', 'PG', 'SG', 'SF', 'PF', 'C'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchRes = await axios.get(`/data-entry/schedules/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setMatch(matchRes.data);

        const playersRes = await axios.get(`/data-entry/players/by-match/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setPlayers(playersRes.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load data');
      }
    };
    fetchData();
  }, [matchId]);

  useEffect(() => {
    const checkLineup = async () => {
      try {
        const lineupRes = await axios.get(`/data-entry/lineups/check/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });

        if (lineupRes.data) {
          setLineup({
            teamHome: {
              team: lineupRes.data.teamHome.team,
              starters: lineupRes.data.teamHome.starters,
              substitutions: lineupRes.data.teamHome.substitutions,
            },
            teamAway: {
              team: lineupRes.data.teamAway.team,
              starters: lineupRes.data.teamAway.starters,
              substitutions: lineupRes.data.teamAway.substitutions,
            },
          });
          setLineupId(lineupRes.data._id);
        }
      } catch (err) {
        console.error('No existing lineup found');
      }
    };

    checkLineup();
  }, [matchId]);

  const handleChange = (teamType, role, index, field, value) => {
    const updated = { ...lineup };
    updated[teamType][role][index][field] = value;
    setLineup(updated);
  };

  const handleAddPlayer = (teamType, role) => {
    const updated = { ...lineup };
    updated[teamType][role].push({ player: '', position: '' });
    setLineup(updated);
  };

  const handleRemovePlayer = (teamType, role, index) => {
    const updated = { ...lineup };
    updated[teamType][role].splice(index, 1);
    setLineup(updated);
  };

  const normalizePlayers = (players) =>
    players.map((p) => ({
      player: typeof p.player === 'object' ? p.player._id : p.player,
      position: p.position,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate players
    const duplicates = [];
    ['teamHome', 'teamAway'].forEach((teamKey) => {
      const allPlayers = [
        ...lineup[teamKey].starters.map((p) =>
          typeof p.player === 'object' ? p.player._id : p.player
        ),
        ...lineup[teamKey].substitutions.map((p) =>
          typeof p.player === 'object' ? p.player._id : p.player
        ),
      ];
      const seen = new Set();
      for (const playerId of allPlayers) {
        if (!playerId) continue;
        if (seen.has(playerId)) {
          duplicates.push(playerId);
        }
        seen.add(playerId);
      }
    });

    if (duplicates.length > 0) {
      alert('A player cannot appear more than once in the lineup or subs.');
      return;
    }

    const payload = {
      gameId: matchId,
      teamHome: {
        team: match.homeTeam._id,
        starters: normalizePlayers(lineup.teamHome.starters),
        substitutions: normalizePlayers(lineup.teamHome.substitutions),
      },
      teamAway: {
        team: match.awayTeam._id,
        starters: normalizePlayers(lineup.teamAway.starters),
        substitutions: normalizePlayers(lineup.teamAway.substitutions),
      },
    };

    try {
      if (lineupId) {
        await axios.put(`/data-entry/lineups/${lineupId}`, payload, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        alert('Lineup updated!');
      } else {
        await axios.post('/data-entry/lineups', payload, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        alert('Lineup created!');
      }

      navigate(`/data-entry/live-coverage/${matchId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save lineups');
    }
  };

  const renderLineupForm = (teamType, teamName, playerList) => (
    <div>
      <h3 className="text-lg font-bold mb-2">{teamName} Starters</h3>
      {lineup[teamType].starters.map((p, i) => (
        <div key={i} className="flex gap-4 mb-2 items-center">
          <select
            value={typeof p.player === 'object' ? p.player._id : p.player}
            onChange={(e) => handleChange(teamType, 'starters', i, 'player', e.target.value)}
            className="border p-2 rounded w-1/2"
          >
            <option value="">Select Player</option>
            {playerList.map((player) => (
              <option key={player._id} value={player._id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
          <select
            value={p.position}
            onChange={(e) => handleChange(teamType, 'starters', i, 'position', e.target.value)}
            className="border p-2 rounded w-1/2"
          >
            <option value="">Select Position</option>
            {positionOptions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleRemovePlayer(teamType, 'starters', i)}
            className="text-red-600 text-sm ml-2"
            title="Remove"
          >
            🗑️
          </button>
        </div>
      ))}
      <button
        onClick={() => handleAddPlayer(teamType, 'starters')}
        type="button"
        className="text-sm text-blue-600 mb-4"
      >
        + Add Starter
      </button>

      <h3 className="text-lg font-bold mb-2">{teamName} Substitutes</h3>
      {lineup[teamType].substitutions.map((p, i) => (
        <div key={i} className="flex gap-4 mb-2 items-center">
          <select
            value={typeof p.player === 'object' ? p.player._id : p.player}
            onChange={(e) => handleChange(teamType, 'substitutions', i, 'player', e.target.value)}
            className="border p-2 rounded w-1/2"
          >
            <option value="">Select Player</option>
            {playerList.map((player) => (
              <option key={player._id} value={player._id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
          <select
            value={p.position}
            onChange={(e) => handleChange(teamType, 'substitutions', i, 'position', e.target.value)}
            className="border p-2 rounded w-1/2"
          >
            <option value="">Select Position</option>
            {positionOptions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleRemovePlayer(teamType, 'substitutions', i)}
            className="text-red-600 text-sm ml-2"
            title="Remove"
          >
            🗑️
          </button>
        </div>
      ))}
      <button
        onClick={() => handleAddPlayer(teamType, 'substitutions')}
        type="button"
        className="text-sm text-blue-600 mb-6"
      >
        + Add Substitute
      </button>
    </div>
  );

  if (!match) return <p className="p-6">Loading match and players...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        {lineupId ? 'Edit Lineups' : 'Add Lineups'}
      </h2>
      <h4 className="text-lg font-semibold text-gray-800 mb-6">
        {match.homeTeam?.teamName} vs {match.awayTeam?.teamName}
      </h4>

      <form onSubmit={handleSubmit}>
        {renderLineupForm('teamHome', match.homeTeam?.teamName, players.home)}
        {renderLineupForm('teamAway', match.awayTeam?.teamName, players.away)}

        <div className="flex items-center gap-4 mt-4">
          {lineupId && (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete the lineup?')) {
                  try {
                    await axios.delete(`/data-entry/lineups/${lineupId}`, {
                      headers: { Authorization: localStorage.getItem('token') },
                    });
                    alert('Lineup deleted!');
                    navigate(`/data-entry/live-coverage/${matchId}`);
                  } catch (err) {
                    console.error(err);
                    alert('Failed to delete lineup');
                  }
                }
              }}
              className="text-red-600 underline text-sm"
            >
              Delete Lineup
            </button>
          )}

          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
          >
            Save Lineups
          </button>
        </div>
      </form>
    </div>
  );
}
