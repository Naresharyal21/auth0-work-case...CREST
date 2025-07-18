import { useParams } from "react-router";
import useUsers from "../hooks/useUsers";
import UserCard from "../components/UserCard";
import withUserAdditionalInfo from "../hoc/withUserAdditionalInfo";
import useSortUsers from "../hooks/useSortUsers";

const UserDetail = () => {
    const { userID } = useParams();

    const { users, loading, error } = useUsers(userID);
      const { user, totalUsers } = useSortUsers(null , page);

    const UserCardWithAdditionalInfo = withUserAdditionalInfo(UserCard, users[0]);

    return (
        <div className="">
            <div className="flex mb-20">
                <h1 className="">Users</h1>
            </div>
            <div>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}

                {users.length > 0 && (
                    <UserCardWithAdditionalInfo />
                )}
            </div>
        </div>
    )
}

export default UserDetail;