
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyFantasyTeams } from '../slices/fantasyTeamSlice';
import dayjs from 'dayjs';

export default function MyTeam(){

const dispatch = useDispatch();

  const { fantasyTeamByUser, loading, serverError } = useSelector(state => state.fantasyTeam);

  useEffect(() => {
    dispatch(fetchMyFantasyTeams());
  }, [dispatch]);

  const isMatchPast = (matchDate) => {
    return dayjs(matchDate).isBefore(dayjs());
  };

  if (loading) return <div>Loading your fantasy teams...</div>;
  if (serverError) return <div>Error: {serverError.error}</div>;
  if (fantasyTeamByUser.length === 0) return <div>No fantasy teams created yet.</div>;

  return (
    <div className="my-teams-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Fantasy Teams</h1>
      {fantasyTeamByUser.map(team => {
        const matchDate = team.gameId.matchDate;
        const pastMatch = isMatchPast(matchDate);

        return (
          <div
            key={team._id}
            className={`border rounded p-4 mb-4 ${pastMatch ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{team.teamName}</h2>
              <span className="text-sm text-gray-600">
                Match Date: {dayjs(matchDate).format('DD MMM YYYY, hh:mm A')}
              </span>
            </div>

            <div className="mb-2 text-sm text-gray-700">
              <strong>Match:</strong> {team.gameId.homeTeam.teamName} vs {team.gameId.awayTeam.teamName}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {team.players.map(p => {
                const player = p.playerInfo || p.playerId; // depending on populated data
                return (
                  <div key={player._id} className="p-2 border rounded bg-white">
                    <img src={player.profileImage} alt={player.firstName} className="w-16 h-16 rounded-full mx-auto" />
                    <div className="text-center mt-1">
                      <div className="font-semibold">{player.firstName} {player.lastName}</div>
                      <div className="text-xs">{player.position}</div>
                      {p.isCaptain && <span className="text-xs text-blue-600 font-bold">Captain</span>}
                      {p.isViceCaptain && <span className="text-xs text-green-600 font-bold ml-1">Vice-Captain</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {pastMatch && <div className="mt-2 text-red-600 font-semibold">Match Played (Team Locked)</div>}
          </div>
        );
      })}
    </div>
  );
};

