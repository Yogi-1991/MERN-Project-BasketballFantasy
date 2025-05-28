import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute(props){
    const {userData} = useSelector((state)=>{
            return state.user
    })

    if(localStorage.getItem('token') && userData){
        return props.children;
    }else if(localStorage.getItem('token') && !userData){
            return false
    }else{
        return <Navigate to='/'/>
    }

}