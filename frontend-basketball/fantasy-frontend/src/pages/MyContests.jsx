import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getUserContests} from '../slices/contestsSlice';
import { Link } from "react-router-dom";

export default function MyContests() {
  const dispatch = useDispatch();
  const { contestsData, serverError } = useSelector((state) => state.contest);

  useEffect(() => {
    dispatch(getUserContests());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">My Contests</h2>

      {serverError && <p className="text-red-600">{serverError}</p>}

      {contestsData.length === 0 ? (
        <p className="text-gray-500">You haven’t joined any contests yet.</p>
      ) : (
        <div className="grid gap-4">
          {contestsData.map((contest) => (
            <Link to={`/contest/${contest._id}`} key={contest._id}>
            <div  className="bg-white p-4 rounded shadow border-l-4 border-orange-400">
              <h3 className="text-lg font-semibold text-gray-700">
                {contest.name || "Unnamed Contest"}
              </h3>
              <p className="text-sm text-gray-500">Type: {contest.type}</p>
              <p className="text-sm text-gray-500">Entry Fee: ₹{contest.entryFee}</p>
              <p className="text-sm text-gray-500">Prize Pool: ₹{contest.prizePool}</p>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
