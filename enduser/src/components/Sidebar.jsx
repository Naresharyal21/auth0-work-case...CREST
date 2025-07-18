import { Link, NavLink } from "react-router-dom";


import useAuth from "../hooks/useAuth";
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = () => {

    const { logout } = useAuth()
    const { logout:auth0Logout } = useAuth0()

const handleLogout = () =>{
    logout();
    auth0Logout({ returnTo: window.location.origin })
}
    return (
        <div className="sidebar">
            <div className="logo p-20">ZARA</div>

            <ul className="menu">
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/products">Products</Link>
                </li>
                <li>
                    <Link to="/products/add-product">Add Products</Link>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
                <li onClick={handleLogout}>
                    <p>Logout</p>
                </li>
            </ul>

        </div>
    )
}

export default Sidebar