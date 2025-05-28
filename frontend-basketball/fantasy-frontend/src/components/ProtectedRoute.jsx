import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function ProtectedRoute(props){

    const {userData} = useSelector((state)=>{
        return state.user
    })
    
   if(props.roles.includes(userData.role)){
     return props.children
   }else{
       return <Navigate to="/unauthorized"/>
   }
    
}