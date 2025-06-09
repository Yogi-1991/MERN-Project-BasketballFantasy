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

export default function ProtectedRoute(props) {
  const { userData } = useSelector((state) => state.user);

  // If no user or role mismatch
  if (!userData || !props.roles.includes(userData.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If dataEntry user and a task is required, check for that task
  if (
    userData.role === 'dataEntry' &&
    props.requiredTask && 
    !userData.dataEntryTasks?.includes(props.requiredTask)
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return props.children;
}


