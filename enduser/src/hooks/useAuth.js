import { useContext } from "react";
import { AuthenticationContext } from "../components/AuthContext";

const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthContext.");
  }

  const { user, loginUser, logoutUser } = context;

  return {
    user,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated: !!user?.isAuthenticated,
  };
};

export default useAuth;
