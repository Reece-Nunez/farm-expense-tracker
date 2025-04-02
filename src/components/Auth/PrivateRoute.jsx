// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function PrivateRoute({ children }) {
  const { user } = useAuthenticator((context) => [context.user]);

  // If there's no user, they're not signed in.
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Otherwise, render whatever is inside <PrivateRoute> ... </PrivateRoute>
  return children;
}
