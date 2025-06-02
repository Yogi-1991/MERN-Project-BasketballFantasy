import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TeamFoundMsg() {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (redirect) {      
    return <Navigate to="/dashboard" />;

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="bg-white shadow-md rounded-lg p-8 text-center border border-orange-200">
        <h2 className="text-2xl font-bold text-red-600 mb-4">You have already created a team for this game</h2>
      </div>
    </div>
  );
}
