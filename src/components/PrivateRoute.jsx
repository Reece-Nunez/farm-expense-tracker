import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";

export default function PrivateRoute({ children }) {
  const location = useLocation();

  return (
    <Authenticator>
      {({ user }) => {
        if (!user) {
          return <Navigate to="/" state={{ from: location }} />;
        }
        return children;
      }}
    </Authenticator>
  );
}
