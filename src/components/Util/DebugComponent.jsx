import React, { useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Field } from "../../models";

function DebugComponent() {
  const handleClearStore = async () => {
    await DataStore.clear();
    alert("Local DataStore cleared!");
    window.location.reload();
  };

  const fetchAndLogFields = async () => {
    try {
      const fields = await DataStore.query(Field);
      console.log("All Fields:", fields);
    } catch (err) {
      console.error("Error fetching fields:", err);
    }
  };

  useEffect(() => {
    fetchAndLogFields();
  }, []);

  return (
    <div style={{ border: "1px solid red", padding: "1rem", margin: "1rem" }}>
      <h3>Debug Panel</h3>
      <button onClick={handleClearStore} style={{ marginRight: "1rem" }}>
        Clear DataStore
      </button>
      <button onClick={fetchAndLogFields}>
        Log Fields
      </button>
      <button
        onClick={async () => {
          await DataStore.clear();
          await DataStore.start();
          alert("DataStore cleared & re-synced.");
        }}
      >
        Clear & Restart DataStore
      </button>

    </div>
  );
}

export default DebugComponent;
