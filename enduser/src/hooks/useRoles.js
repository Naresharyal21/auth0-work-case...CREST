import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; //this is for autho 0 role based login

const useRoles = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true); // 👈

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (!isAuthenticated) {
          setRoles([]);
          setLoadingRoles(false);
          return;
        }

        const token = await getAccessTokenSilently();
        const decoded = jwtDecode(token);
        const userRoles = decoded["https://yourapp.com/roles"] || [];
        setRoles(userRoles);
        console.log(`from auth0 role is:${userRoles}`);
      } catch (err) {
        console.error("Error getting roles from token:", err);
      } finally {
        setLoadingRoles(false); // ✅ finish loading
      }
    };

    fetchRoles();
  }, [getAccessTokenSilently, isAuthenticated]);

  return { roles, loadingRoles };
};

export default useRoles;
