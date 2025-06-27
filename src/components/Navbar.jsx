import useAuth from '../hooks/useAuth';
import { getInitials } from '../utils/stringUtils';

const Navbar = () => {

    const { user } = useAuth();

    return (
        <div className="navbar w-space-available flex justify-content-right">
            <div className="user-avatar flex align-items-center justify-content-center">
                { user?.picture
                ?<img src={user.picture} alt ={user.name}/>
                 :<>
                 { getInitials(user?.name)}
                 </>  
                }
            </div>
        </div>
    )
}

export default Navbar;