import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Income } from "@/models";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ImportIncomeCSV() {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }
    setParsing(true);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Filter out empty or invalid rows
            const validRows = results.data.filter(
              (row) => row.Date && row.Item
            );

            const session = await fetchAuthSession();
            const userId = session.tokens.idToken.payload.sub;

            const newIncomes = validRows.map((row) => {
              // 1) Parse date => AWSDate
              const rawDate = (row.Date || "").replace(/['"]/g, "").trim();
              let isoDate = "";
              if (rawDate) {
                const d = new Date(rawDate);
                if (!isNaN(d.getTime())) {
                  isoDate = d.toISOString().split("T")[0];
                }
              }

              // 2) Parse quantity & price
              const quantity =
                parseFloat((row.Quantity || "").replace(/[,$]/g, "")) || 0;
              const price =
                parseFloat((row.Price || "").replace(/[$,]/g, "")) || 0;

              // 3) Compute final amount
              const amount = quantity * price;

              // 4) Payment Method from CSV
              const paymentMethod = row["Payment Method"] || "";

              return {
                userId, // required
                date: isoDate, // required for AWSDate
                item: row.Item || "Other",
                quantity,
                price,
                amount,
                paymentMethod,
                notes: "",
              };
            });

            // Save to DataStore
            const savedItems = await Promise.all(
              newIncomes.map((inc) => DataStore.save(new Income(inc)))
            );

            toast.success(`Imported ${savedItems.length} income records!`);
            setParsing(false);
            navigate("/income");
          } catch (err) {
            console.error("Error processing CSV:", err);
            toast.error("Failed to import CSV data.");
            setParsing(false);
          }
        },
        error: (error) => {
          console.error("PapaParse error:", error);
          toast.error("Error reading CSV file.");
          setParsing(false);
        },
      });
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to parse CSV file.");
      setParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-center bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-green-700 mb-3">
            Import Income via CSV
          </h1>
          <p className="text-gray-500 text-sm">
            Quickly add multiple income records from a CSV file
          </p>
        </CardHeader>
        <CardContent className="bg-white px-8 py-6 space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="
                block w-full text-sm text-gray-900
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-green-500 file:text-white
                hover:file:bg-green-600
                transition-colors
                cursor-pointer
              "
            />
            <p className="mt-1 text-xs text-gray-500 italic">
              CSV columns must include:
              <strong> Date, Item, Quantity, Price, Payment Method</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleImport}
              disabled={parsing}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              {parsing ? "Importing..." : "Import CSV"}
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
