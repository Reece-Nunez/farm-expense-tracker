import { useEffect } from "react";
import { DataStore } from "aws-amplify/datastore";

export default function ClearDataStoreOnce() {
  useEffect(() => {
    const clearStore = async () => {
      console.log("Clearing DataStore...");
      await DataStore.clear();
      await DataStore.start();
      console.log("DataStore cleared and restarted.");
    };

    clearStore();
  }, []);

  return null; // You don't need to render anything
}
