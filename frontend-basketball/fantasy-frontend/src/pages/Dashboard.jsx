import { useDispatch } from "react-redux";
import { logout } from "../slices/userSlice";
import { toast } from 'react-toastify';

import { useNavigate,Link } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function Dashboard() {
    
   
    const {data, isLoggedIn} = useSelector((state)=>{
        console.log("called Slice")
        return state.user
   });
   console.log("slice data",data)
//    if(!data){
//     return false
//    }
   const dispatch = useDispatch();
   const navigate = useNavigate();  


    const handleLogout = ()=>{
        localStorage.removeItem('token');
        dispatch(logout());
        toast.success('Logged out successfully 👋');
        navigate('/'); 
     }
     
    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 to-orange-300">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-xl text-center border-4 border-orange-500">
        {isLoggedIn?<>
        <h2 className="text-3xl font-extrabold mb-4 text-orange-600 tracking-wider">
          Welcome {data?.name || "User"}!
          </h2>
          <p className="text-sm text-gray-500 mb-6">{data?.email}</p>
          <p className="text-gray-700 mb-6 text-lg">
            You're now login. Draft your dream team and compete to be the best!
          </p>
  
          <button
            onClick={handleLogout}
            className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700 transition-all font-semibold"
          >
            Logout
          </button>
        </> :
        <>
        <p className="text-gray-700 mb-6 text-lg">
            Please <a href='/'><b><span style={{"color":"red"}}>login</span></b></a> to Draft your dream team and compete to be the best!
            
          </p>
        </>}
        
          
        </div>
      </div>
    );
  }