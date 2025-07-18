import { useEffect, useState } from "react";
import { SortUsers } from "../api/productApi";

const useSortUsers = (page = 1, isSorted = false) => {
  const [user, setUser] = useState([]);

  const getSortUsers = async () => {
    const { data } = await SortUsers(page);

    setUser(data?.users || []);
  
  };

  useEffect(() => {
    getSortUsers();
  }, [page, isSorted]);

  return {
    user,
  };
};

export default useSortUsers;
