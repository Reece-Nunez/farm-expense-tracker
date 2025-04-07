import React, { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";

export default function AuthGate() {
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const clearDataStoreAndReload = async () => {
      try {
        console.log("[AuthGate] Clearing DataStore...");
        await DataStore.stop();         // Ensure everything is stopped
        await DataStore.clear();        // Now it's safe to clear
        console.log("[AuthGate] DataStore cleared. Reloading...");
        window.location.href = "/dashboard";  // Avoid soft-refresh issues
      } catch (err) {
        console.error("[AuthGate] Failed to clear DataStore:", err);
      }
    };

    // Only run this logic the FIRST time after login
    const freshLoginFlag = localStorage.getItem("justSignedIn");

    if (user && freshLoginFlag !== "false") {
      localStorage.setItem("justSignedIn", "false");
      clearDataStoreAndReload();
    }
  }, [user]);

  // For future logins
  useEffect(() => {
    if (!user) {
      localStorage.setItem("justSignedIn", "true");
    }
  }, [user]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <Authenticator />
    </div>
  );
}
