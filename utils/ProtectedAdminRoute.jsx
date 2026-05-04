import { Navigate } from "react-router";


function ProtectedAdminRoute({user,children}) {

    if(!user) {
        return <Navigate to='/sign-in' replace/>
    }

    if(!user.is_admin){
        return <Navigate to='/products' replace/>
    }
  
    return children
}

export default ProtectedAdminRoute