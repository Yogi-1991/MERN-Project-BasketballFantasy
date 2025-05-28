import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Unauthorized() {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="bg-white shadow-md rounded-lg p-8 text-center border border-orange-200">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
        <p className="text-gray-700">You will be redirected to login in 2 seconds...</p>
      </div>
    </div>
  );
}
