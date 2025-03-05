import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Expense } from "@/models";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon } from "@heroicons/react/outline";

export default function ImportExpensesCSV() {
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
            // 1) Filter out empty lines
            const validRows = results.data.filter((row) => row.Date);

            const session = await fetchAuthSession();
            const userId = session.tokens.idToken.payload.sub;

            // 2) Map each row
            const newExpenses = validRows.map((row) => {
              const rawDate = (row.Date || "").replace(/['"]/g, "").trim();
              let isoDate = "";
              if (rawDate) {
                const d = new Date(rawDate);
                if (!isNaN(d.getTime())) {
                  isoDate = d.toISOString().split("T")[0];
                }
              }

              const unitCost =
                parseFloat((row.Cost || "").replace(/[$,]/g, "")) || 0;
              const quantity = parseInt(row.Quantity || 0, 10);
              const totalCost = unitCost * quantity;

              return {
                userId,
                date: isoDate,
                category: row.Category || "",
                item: row.Product || "",
                vendor: row.Vendor || "",
                unitCost,
                quantity,
                totalCost,
                description: row.Description || "",
              };
            });

            // 3) Save each expense
            const savedItems = await Promise.all(
              newExpenses.map((exp) => DataStore.save(new Expense(exp)))
            );

            toast.success(
              `Successfully imported ${savedItems.length} expenses!`
            );
            // Wrap up when done
            setParsing(false);
            navigate("/expenses");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-center bg-white p-6 shadow-sm">
          <CloudUploadIcon className="w-16 h-16 text-blue-600 mb-3" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Import Expenses via CSV
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Easily upload a CSV file to quickly add expenses
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
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-600
                transition-colors
                cursor-pointer
              "
            />
            <p className="mt-1 text-xs text-gray-500 italic">
              Your CSV should have columns like: Date, Category, Item, Vendor,
              Cost, Quantity, Description.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleImport}
              disabled={parsing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
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
