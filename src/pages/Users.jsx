import { useNavigate } from "react-router";

import useUsers from "../hooks/useUsers";
import UserCard from "../components/UserCard";
import { useState } from "react";
import Pagination from "./Pagination";


import { AiOutlineSortAscending } from "react-icons/ai";
import useSortUsers from "../hooks/useSortUsers";
import withAuthorization from "../hoc/withAuthorization";

const Users = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { users, loading, totalUsers } = useUsers(null , page);
      const [isSorted, setIsSorted] = useState(false);
    const {user} = useSortUsers(page, isSorted)

    const totalPages = Math.ceil(totalUsers / 6);

    const handleViewUser = (userId) => {
        navigate(`/users/${userId}`);
    }
    const handleSortUsers =()=>{
     setIsSorted((prev) => !prev); // 🔁 Toggle sort state
        setPage(1); // Reset to first page when toggling

    }

    return (
        <div className="">
            <div className="flex mb-20">
                <div className="wrapperUser">
                <h1 className="">Users</h1>
                <button onClick={handleSortUsers}><AiOutlineSortAscending /></button>
            </div>
            </div>

            {loading && (
                <div className="loading-message">Loading...</div>
            )}

            <div className="grid gap-15 grid-cols-3">
             {
        (isSorted ? user : users).map((user) => (
            <div key={user.id} onClick={() => handleViewUser(user.id)} className="cursor-pointer user-card">
                <UserCard user={user} />
            </div>
        ))
    }
            </div>

             <div className="flex  gap-15">
<Pagination 
currentPage={page}
totalPages={totalPages}
onPageChange={(newPage)=> setPage(newPage)}
/>


            </div>
            
        </div>
        
    )
}

export default  withAuthorization(Users, ["ADMIN","SUPER_ADMIN"]);