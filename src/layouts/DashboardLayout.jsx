import { Navigate, Outlet } from "react-router";

import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {

    const { isAuthenticated } = useAuth();

    return (
        <>
            {
                isAuthenticated
                    ? (
                        <div className="dashboard-layout">
                            <Sidebar />
                            <div className="dashboard-content">
                                <Navbar />
                                <div className="content">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    ) : <Navigate to="/auth/login" replace={true} />
            }
        </>
    )
}

export default DashboardLayout