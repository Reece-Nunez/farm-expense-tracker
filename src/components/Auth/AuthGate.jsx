import React, { useEffect, useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

export default function AuthGate() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [ready, setReady] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        localStorage.setItem("justSignedIn", "true");
        return;
      }

      const freshLoginFlag = localStorage.getItem("justSignedIn");

      if (freshLoginFlag === "true") {
        localStorage.setItem("justSignedIn", "false");

        try {
          console.log("[AuthGate] Refreshing session after sign-in...");
          await fetchAuthSession();
        } catch (err) {
          console.error("[AuthGate] Session refresh failed:", err);
        }
      }

      setRedirect(true);
    };

    run();
  }, [user]);

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <Authenticator />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      Loading dashboard... Please refresh the page if stuck...
    </div>
  );
}
