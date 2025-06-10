import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


// export default function ProtectedRoute(props){

//     const {userData} = useSelector((state)=>{
//         return state.user
//     })
    
//    if(props.roles.includes(userData.role)){
//      return props.children
//    }else{
//        return <Navigate to="/unauthorized"/>
//    }
    
// }

//protected route updated

export default function ProtectedRoute({ roles = [], requiredTasks = [], children }) {
  const { userData } = useSelector((state) => state.user);

  // Block if no user or role mismatch
  if (!userData || (!roles.includes(userData.role) && userData.role !== 'admin')) {
      return <Navigate to="/unauthorized" />;
  }

  if (userData.role === 'admin') {
    return children; // Admin bypasses all
  }

  // If role is dataEntry and tasks are specified, ensure they have at least one
  if (userData.role === 'dataentry' && requiredTasks.length > 0 && !requiredTasks.some(task => userData.dataEntryTasks?.includes(task))){
    return <Navigate to="/unauthorized" />;
  }

  
  return children;
}



