import React, { useEffect, useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

export default function AuthGate() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const handleSessionReset = async () => {
      try {
        console.log("[AuthGate] Fetching new session and clearing local state...");
        const session = await fetchAuthSession();
        console.log("[AuthGate] Session refreshed:", session);
        setRedirect(true);
      } catch (err) {
        console.error("[AuthGate] Failed to refresh session:", err);
      }
    };

    const freshLoginFlag = localStorage.getItem("justSignedIn");

    if (user && freshLoginFlag !== "false") {
      localStorage.setItem("justSignedIn", "false");
      handleSessionReset();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("justSignedIn", "true");
    }
  }, [user]);

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Authenticator />
    </div>
  );
}