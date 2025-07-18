import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';

export default function AdminViewParticipants() {
  const { id } = useParams(); // contestId
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(`/admin/contests/participants/${id}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setParticipants(res.data);
      } catch (err) {
        console.log(err);
        alert('Failed to fetch participants');
      }
    };
    fetchParticipants();
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Contest Participants</h2>
      <table className="w-full border bg-white">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border">User</th>
            <th className="px-4 py-2 border">Team</th>
            <th className="px-4 py-2 border">Points</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2 border">{p.userId?.name || 'N/A'}</td>
              <td className="px-4 py-2 border">{p.fantasyTeamId?.teamName || 'N/A'}</td>
              <td className="px-4 py-2 border">{p.fantasyTeamId?.totalFantasyPoints || 0}</td>
            </tr>
          ))}
          {!participants.length && (
            <tr>
              <td colSpan="3" className="text-center text-gray-500 py-4">
                No participants found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
