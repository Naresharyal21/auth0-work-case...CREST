import { createContext, useState } from "react";

export const AuthenticationContext = createContext(null);

const AuthContext = ({ children }) => {
    const persistedUser = localStorage.getItem("user");
    const initialUser = persistedUser ? JSON.parse(persistedUser) : {};

    const [user, setUser] = useState(initialUser);

    const loginUser = (user) => {
        user = {
            ...user,
            isAuthenticated: true,
        };

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    }

    const logoutUser = () => {
        setUser({});
        localStorage.removeItem("user");
    }

    return (
        <AuthenticationContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthenticationContext.Provider>
    )
}

export default AuthContext;
  const namespace = "https://localhost3000.com";