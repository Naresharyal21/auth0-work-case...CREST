import { useEffect, useState } from "react";
import { fetchUserById, fetchUsers } from "../api/productApi";

const useUsers = (id,page=1) => {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
 const [totalUsers, settotalUsers] = useState(0);
  const getUsers = async () => {
    setLoading(true);

    if (id) {
      const { data, error } = await fetchUserById(id);

      setLoading(false);

      if (error) {
        setError(error);
        return;
      }

      setUsers([data]);

      return;
    }
   

    const { data, error } = await fetchUsers(page);

    setLoading(false);

    if (error) {
      setError(error);

      return;
    }

    setUsers(data?.users || []);
    settotalUsers(data?.total || 0);
  };

  useEffect(() => {
    getUsers();
  }, [id,page]);

  return {
    error,
    loading,
    users,
    totalUsers
  };
};

export default useUsers;
