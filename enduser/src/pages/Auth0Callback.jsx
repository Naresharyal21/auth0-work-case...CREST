import { useEffect } from "react";
import useAuth from "../hooks/useAuth"
import { useAuth0 } from "@auth0/auth0-react";

 export const Auth0Callback = () =>{
      

     const {login} = useAuth();
     const { user, isAuthenticated, isLoading } = useAuth0();
       

     useEffect(()=>{

if(isAuthenticated){
    const loggedInUser ={
        name : user?.name,
        email:user?.email,
        picture:user?.picture,


    }
   login(loggedInUser) ;
}
},[isAuthenticated,user]);
    return(


        <div>
            {
                isLoading&&<h1>Authenticating...</h1>
            }
            
            
            <button onClick={()=>window.location.href='/'}>Go to Home</button>
        </div>
    )
}