import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const AuthLayout = () => {

    const { isAuthenticated } = useAuth();

    return (
        <>
            {
                !isAuthenticated
                    ? <div className="flex-col">
                        <div className="">
                            <Outlet />
                        </div>
                    </div>
                    : <Navigate to="/" replace={true} />

            }
        </>
    )
}

export default AuthLayout