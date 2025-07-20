

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../config/axios";

// export default function ManageContests() {
//   const [contests, setContests] = useState([]);
//   const [filteredContests, setFilteredContests] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState(""); // upcoming, running, completed
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchContests();
//   }, []);

//   const fetchContests = async () => {
//     try {
//       const res = await axios.get("/contests", {
//         headers: { Authorization: localStorage.getItem("token") },
//       });
//       setContests(res.data);
//       setFilteredContests(res.data);
//     } catch (err) {
//       console.error("Failed to fetch contests", err);
//     }
//   };

//   // Search & Filter
//   useEffect(() => {
//     let result = contests;

//     if (searchTerm) {
//       result = result.filter((c) =>
//         c.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterStatus) {
//       result = result.filter((c) => c.status === filterStatus);
//     }

//     setFilteredContests(result);
//   }, [searchTerm, filterStatus, contests]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this contest?")) {
//       try {
//         await axios.delete(`/admin/contests/${id}`, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         alert("Contest deleted");
//         fetchContests();
//       } catch (err) {
//         alert("Failed to delete");
//       }
//     }
//   };

//   const handleDistributePrizes = async (id) => {
//     if (window.confirm("Distribute prizes for this contest?")) {
//       try {
//         await axios.post(`/admin/contests/distribute/${id}`, {}, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         alert("Prizes distributed successfully");
//         fetchContests();
//       } catch (err) {
//         alert("Failed to distribute prizes");
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-orange-600">Manage Contests</h2>
//         <Link
//           to="/admin/contests/create"
//           className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//         >
//           + Create Public Contest
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="border p-2 rounded w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Status</option>
//           <option value="upcoming">Upcoming</option>
//           <option value="in-progress">In-Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="py-2 px-4 border">Match</th>
//               <th className="py-2 px-4 border">Contest Name</th>
//               <th className="py-2 px-4 border">Type</th>
//               <th className="py-2 px-4 border">Entry Fee</th>
//               <th className="py-2 px-4 border">Prize Pool</th>
//               <th className="py-2 px-4 border">Spots</th>
//               <th className="py-2 px-4 border">Status</th>
//               <th className="py-2 px-4 border">Prizes</th>
//               <th className="py-2 px-4 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredContests.map((c) => (
//               <tr key={c._id} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border">
//                   {c.gameId?.homeTeam?.teamName} vs {c.gameId?.awayTeam?.teamName}
//                   <br />
//                   {new Date(c.gameId?.matchDate).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4 border capitalize">{c.name}</td>
//                 <td className="py-2 px-4 border capitalize">{c.type}</td>
//                 <td className="py-2 px-4 border">{c.entryFee} ₹</td>
//                 <td className="py-2 px-4 border">{c.prizePool} ₹</td>
//                 <td className="py-2 px-4 border">
//                   {c.participants.length}/{c.maxPlayers}
//                 </td>
//                 <td className="py-2 px-4 border capitalize">{c.status}</td>
//                 <td className="py-2 px-4 border">
//                   {c.prizesDistributed ? "✅ Distributed" : "❌ Pending"}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   <button
//                     onClick={() => navigate(`/admin/contests/edit/${c._id}`)}
//                     className="text-blue-600 hover:underline mr-3"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     className="text-red-600 hover:underline mr-3"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => navigate(`/admin/contests/participants/${c._id}`)}
//                     className="text-green-600 hover:underline mr-3"
//                   >
//                     View
//                   </button>
//                   {!c.prizesDistributed && c.status === "completed" && (
//                     <button
//                       onClick={() => handleDistributePrizes(c._id)}
//                       className="text-purple-600 hover:underline"
//                     >
//                       Distribute
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {!filteredContests.length && (
//               <tr>
//                 <td colSpan="9" className="text-center py-4 text-gray-500">
//                   No contests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../config/axios";

// export default function ManageContests() {
//   const [contests, setContests] = useState([]);
//   const [filteredContests, setFilteredContests] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [winners, setWinners] = useState([]);
//   const [showWinnersModal, setShowWinnersModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchContests();
//   }, []);

//   const fetchContests = async () => {
//     try {
//       const res = await axios.get("/contests", {
//         headers: { Authorization: localStorage.getItem("token") },
//       });
//       setContests(res.data);
//       setFilteredContests(res.data);
//     } catch (err) {
//       console.error("Failed to fetch contests", err);
//     }
//   };

//   // Search & Filter
//   useEffect(() => {
//     let result = contests;

//     if (searchTerm) {
//       result = result.filter((c) =>
//         c.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterStatus) {
//       result = result.filter((c) => c.status === filterStatus);
//     }

//     setFilteredContests(result);
//   }, [searchTerm, filterStatus, contests]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this contest?")) {
//       try {
//         await axios.delete(`/admin/contests/${id}`, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         alert("Contest deleted");
//         fetchContests();
//       } catch (err) {
//         alert("Failed to delete");
//       }
//     }
//   };

//   const handleDistributePrizes = async (id) => {
//     if (window.confirm("Distribute prizes for this contest?")) {
//       try {
//         await axios.post(`/admin/contests/distribute/${id}`, {}, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         alert("Prizes distributed successfully");
//         fetchContests();
//       } catch (err) {
//         alert("Failed to distribute prizes");
//       }
//     }
//   };

//   const handleViewWinners = async (contestId) => {
//     try {
//       const res = await axios.get(`/admin/contests/${contestId}/winners`, {
//         headers: { Authorization: localStorage.getItem("token") },
//       });
//       setWinners(res.data);
//       setShowWinnersModal(true);
//     } catch (err) {
//       alert("Failed to load winners");
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-orange-600">Manage Contests</h2>
//         <Link
//           to="/admin/contests/create"
//           className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//         >
//           + Create Public Contest
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="border p-2 rounded w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Status</option>
//           <option value="upcoming">Upcoming</option>
//           <option value="in-progress">In-Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="py-2 px-4 border">Match</th>
//               <th className="py-2 px-4 border">Contest Name</th>
//               <th className="py-2 px-4 border">Type</th>
//               <th className="py-2 px-4 border">Entry Fee</th>
//               <th className="py-2 px-4 border">Prize Pool</th>
//               <th className="py-2 px-4 border">Spots</th>
//               <th className="py-2 px-4 border">Status</th>
//               <th className="py-2 px-4 border">Prizes</th>
//               <th className="py-2 px-4 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredContests.map((c) => (
//               <tr key={c._id} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border">
//                   {c.gameId?.homeTeam?.teamName} vs {c.gameId?.awayTeam?.teamName}
//                   <br />
//                   {new Date(c.gameId?.matchDate).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4 border capitalize">{c.name}</td>
//                 <td className="py-2 px-4 border capitalize">{c.type}</td>
//                 <td className="py-2 px-4 border">{c.entryFee} ₹</td>
//                 <td className="py-2 px-4 border">{c.prizePool} ₹</td>
//                 <td className="py-2 px-4 border">
//                   {c.participants.length}/{c.maxPlayers}
//                 </td>
//                 <td className="py-2 px-4 border capitalize">{c.status}</td>
//                 <td className="py-2 px-4 border">
//                   {c.prizesDistributed ? "✅ Distributed" : "❌ Pending"}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   {c.prizesDistributed && (
//                     <button
//                       onClick={() => handleViewWinners(c._id)}
//                       className="text-green-600 hover:underline mr-3"
//                     >
//                       View Winners
//                     </button>
//                   )}
//                   {!c.prizesDistributed && c.status === "completed" && (
//                     <button
//                       onClick={() => handleDistributePrizes(c._id)}
//                       className="text-purple-600 hover:underline"
//                     >
//                       Distribute
//                     </button>
//                   )}
//                   <button
//                     onClick={() => navigate(`/admin/contests/edit/${c._id}`)}
//                     className="text-blue-600 hover:underline mr-3"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     className="text-red-600 hover:underline mr-3"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {!filteredContests.length && (
//               <tr>
//                 <td colSpan="9" className="text-center py-4 text-gray-500">
//                   No contests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Winners Modal */}
//       {showWinnersModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-1/2">
//             <h3 className="text-xl font-bold mb-4">Contest Winners</h3>
//             <ul>
//               {winners.map((w, idx) => (
//                 <li key={idx} className="border-b py-2">
//                   #{idx + 1} {w.userName} - {w.fantasyPoints} pts - {w.amount} ₹
//                 </li>
//               ))}
//             </ul>
//             <button
//               className="mt-4 px-4 py-2 bg-orange-600 text-white rounded"
//               onClick={() => setShowWinnersModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../config/axios";

// export default function ManageContests() {
//   const [contests, setContests] = useState([]);
//   const [filteredContests, setFilteredContests] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState(""); 
//   const [winnersModal, setWinnersModal] = useState(null); // store winners data
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchContests();
//   }, []);

//   const fetchContests = async () => {
//     try {
//       const res = await axios.get("/contests", {
//         headers: { Authorization: localStorage.getItem("token") },
//       });
//       setContests(res.data);
//       setFilteredContests(res.data);
//     } catch (err) {
//       console.error("Failed to fetch contests", err);
//     }
//   };

//   // Search & Filter
//   useEffect(() => {
//     let result = contests;
//     if (searchTerm) {
//       result = result.filter((c) =>
//         c.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (filterStatus) {
//       result = result.filter((c) => c.status === filterStatus);
//     }
//     setFilteredContests(result);
//   }, [searchTerm, filterStatus, contests]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this contest?")) {
//       try {
//         await axios.delete(`/admin/contests/${id}`, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         alert("Contest deleted");
//         fetchContests();
//       } catch (err) {
//         alert("Failed to delete");
//       }
//     }
//   };

//   const handleDistributePrizes = async (id) => {
//     if (window.confirm("Distribute prizes for this contest?")) {
//       try {
//         await axios.post(`/admin/contests/distribute/${id}`, {}, {
//           headers: { Authorization: localStorage.getItem("token") },
//         });
//         alert("Prizes distributed successfully");
//         fetchContests();
//       } catch (err) {
//         alert("Failed to distribute prizes");
//       }
//     }
//   };

//   const handleViewWinners = async (id) => {
//     try {
//       const res = await axios.get(`/admin/contests/winners/${id}`, {
//         headers: { Authorization: localStorage.getItem("token") },
//       });
//       setWinnersModal(res.data.winners || []);
//     } catch (err) {
//       alert("Failed to load winners");
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-orange-600">Manage Contests</h2>
//         <Link
//           to="/admin/contests/create"
//           className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//         >
//           + Create Public Contest
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="border p-2 rounded w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="">All Status</option>
//           <option value="upcoming">Upcoming</option>
//           <option value="in-progress">In-Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="py-2 px-4 border">Match</th>
//               <th className="py-2 px-4 border">Contest Name</th>
//               <th className="py-2 px-4 border">Type</th>
//               <th className="py-2 px-4 border">Entry Fee</th>
//               <th className="py-2 px-4 border">Prize Pool</th>
//               <th className="py-2 px-4 border">Spots</th>
//               <th className="py-2 px-4 border">Status</th>
//               <th className="py-2 px-4 border">Prizes</th>
//               <th className="py-2 px-4 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredContests.map((c) => (
//               <tr key={c._id} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border">
//                   {c.gameId?.homeTeam?.teamName} vs {c.gameId?.awayTeam?.teamName}
//                   <br />
//                   {new Date(c.gameId?.matchDate).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4 border capitalize">{c.name}</td>
//                 <td className="py-2 px-4 border capitalize">{c.type}</td>
//                 <td className="py-2 px-4 border">{c.entryFee} ₹</td>
//                 <td className="py-2 px-4 border">{c.prizePool} ₹</td>
//                 <td className="py-2 px-4 border">
//                   {c.participants.length}/{c.maxPlayers}
//                 </td>
//                 <td className="py-2 px-4 border capitalize">{c.status}</td>
//                 <td className="py-2 px-4 border">
//                   {c.prizesDistributed ? "✅ Distributed" : "❌ Pending"}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   <button
//                     onClick={() => navigate(`/admin/contests/edit/${c._id}`)}
//                     className="text-blue-600 hover:underline mr-3"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(c._id)}
//                     className="text-red-600 hover:underline mr-3"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => navigate(`/admin/contests/participants/${c._id}`)}
//                     className="text-green-600 hover:underline mr-3"
//                   >
//                     View
//                   </button>
//                   {c.prizesDistributed && (
//                     <button
//                       onClick={() => handleViewWinners(c._id)}
//                       className="text-purple-600 hover:underline mr-3"
//                     >
//                       Winners
//                     </button>
//                   )}
//                   {!c.prizesDistributed && c.status === "completed" && (
//                     <button
//                       onClick={() => handleDistributePrizes(c._id)}
//                       className="text-purple-600 hover:underline"
//                     >
//                       Distribute
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {!filteredContests.length && (
//               <tr>
//                 <td colSpan="9" className="text-center py-4 text-gray-500">
//                   No contests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Winners Modal */}
//       {winnersModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
//             <h3 className="text-xl font-bold mb-4 text-orange-600">Winners</h3>
//             {winnersModal.length === 0 ? (
//               <p>No winners recorded.</p>
//             ) : (
//               <ul className="space-y-2">
//                 {winnersModal.map((w, i) => (
//                   <li key={i} className="border p-2 rounded">
//                     <strong>{w.userName}</strong> – {w.fantasyPoints} pts –{" "}
//                     <span className="text-green-600 font-bold">{w.amount} ₹</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//             <button
//               className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
//               onClick={() => setWinnersModal(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";

export default function ManageContests() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [winners, setWinners] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await axios.get("/contests", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setContests(res.data);
      setFilteredContests(res.data);
    } catch (err) {
      console.error("Failed to fetch contests", err);
    }
  };

  // Search & Filter
  useEffect(() => {
    let result = contests;

    if (searchTerm) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      result = result.filter((c) => c.status === filterStatus);
    }

    setFilteredContests(result);
  }, [searchTerm, filterStatus, contests]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      try {
        await axios.delete(`/admin/contests/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        alert("Contest deleted");
        fetchContests();
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleDistributePrizes = async (id) => {
    if (window.confirm("Distribute prizes for this contest?")) {
      try {
        await axios.post(`/admin/contests/distribute/${id}`, {}, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        alert("Prizes distributed successfully");
        fetchContests();
      } catch (err) {
        alert("Failed to distribute prizes");
      }
    }
  };

  const handleViewWinners = async (contestId) => {
    try {
      const res = await axios.get(`/admin/contests/winners/${contestId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setWinners(res.data.winners || []);
      setSelectedContest(res.data.name);
      setShowWinnerModal(true);
    } catch (err) {
      alert("Failed to fetch winners");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Manage Contests</h2>
        <Link
          to="/admin/contests/create"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Create Public Contest
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border">Match</th>
              <th className="py-2 px-4 border">Contest Name</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Entry Fee</th>
              <th className="py-2 px-4 border">Prize Pool</th>
              <th className="py-2 px-4 border">Spots</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Prizes</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContests.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {c.gameId?.homeTeam?.teamName} vs {c.gameId?.awayTeam?.teamName}
                  <br />
                  {new Date(c.gameId?.matchDate).toLocaleString()}
                </td>
                <td className="py-2 px-4 border capitalize">{c.name}</td>
                <td className="py-2 px-4 border capitalize">{c.type}</td>
                <td className="py-2 px-4 border">{c.entryFee} ₹</td>
                <td className="py-2 px-4 border">{c.prizePool} ₹</td>
                <td className="py-2 px-4 border">
                  {c.participants.length}/{c.maxPlayers}
                </td>
                <td className="py-2 px-4 border capitalize">{c.status}</td>
                <td className="py-2 px-4 border">
                  {c.prizesDistributed ? "✅ Distributed" : "❌ Pending"}
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => navigate(`/admin/contests/edit/${c._id}`)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline mr-3"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/admin/contests/participants/${c._id}`)}
                    className="text-green-600 hover:underline mr-3"
                  >
                    View
                  </button>
                  {c.prizesDistributed && (
                    <button
                      onClick={() => handleViewWinners(c._id)}
                      className="text-purple-600 hover:underline mr-3"
                    >
                      View Winners
                    </button>
                  )}
                  {!c.prizesDistributed && c.status === "completed" && (
                    <button
                      onClick={() => handleDistributePrizes(c._id)}
                      className="text-purple-600 hover:underline"
                    >
                      Distribute
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!filteredContests.length && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No contests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Winners Modal */}
      {showWinnerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-xl font-bold mb-4 text-orange-600">
              Winners - {selectedContest}
            </h3>
            {winners.length > 0 ? (
              <ul className="space-y-2">
                {winners.map((w, index) => (
                  <li key={w.userId} className="border p-2 rounded">
                    #{index + 1} - <strong>{w.userName}</strong> ({w.fantasyPoints} pts) - ₹{w.amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No winners recorded</p>
            )}
            <button
              onClick={() => setShowWinnerModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

