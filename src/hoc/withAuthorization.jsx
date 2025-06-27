// src/hoc/withAuthorization.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useAuth from "../hooks/useAuth";
import useRoles from "../hooks/useRoles";

const withAuthorization = (WrappedComponent, requiredRoles = []) => {
  return function AuthorizedComponent(props) {
    const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
    const { roles: auth0Roles, loadingRoles } = useRoles();
    const { user } = useAuth();

    const roles = isAuthenticated ? auth0Roles : user?.roles || [];

    const hasAccess = requiredRoles.some(role => roles.includes(role));

    const stillLoading = (isAuthenticated && loadingRoles) || (!isAuthenticated && !user);

    if (auth0Loading || stillLoading) {
      return <div className="margin-30">Loading role info...</div>;
    }

    if (!hasAccess) {
      return (
        <div className="margin-30">
          You do not have the required role to view this page.
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
