import React from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";

export default function AuthGate() {
  const { user } = useAuthenticator((context) => [context.user]);

  // If the user is already signed in, just bounce them to /dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise show the Amplify UI sign-in form
  return (
    <div style={{ marginTop: "2rem" }}>
      <Authenticator
      />
    </div>
  );
}
