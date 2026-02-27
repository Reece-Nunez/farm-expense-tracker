import React, { useState } from "react";
import  migrateLineItems  from "./migrateLineItems";

export default function DataMigrationUI() {
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState([]);

  const handleRun = async () => {
    setStatus("running");
    setLog(["Starting batch creation..."]);

    try {
      const logBuffer = [];

      await migrateLineItems({
        log: (msg) => {
          logBuffer.push(msg);
          setLog([...logBuffer]);
        },
      });

      logBuffer.push("All mutations complete!");
      setLog([...logBuffer]);
      setStatus("done");
    } catch (error) {
      console.error("Mutation batch failed:", error);
      setLog((prev) => [...prev, `Error: ${error.message}`]);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Line Item Batch Runner</h2>
      <p className="mb-2 text-gray-600">
        This will create all line items from the batch in your list.
      </p>

      <button
        onClick={handleRun}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={status === "running"}
      >
        {status === "running" ? "Running..." : "Run Batch LineItems"}
      </button>

      <div className="mt-4 bg-gray-100 p-3 rounded h-64 overflow-y-scroll">
        {log.map((line, idx) => (
          <div key={idx} className="text-sm font-mono whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
