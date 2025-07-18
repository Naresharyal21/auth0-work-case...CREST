import { Outlet } from "react-router";

const WebsiteLayout = () => {
    return (
        <div className="flex-col">
            Menu bar
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default WebsiteLayout