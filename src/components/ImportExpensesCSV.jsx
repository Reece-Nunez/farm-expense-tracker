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

// Child components
import ColumnMapper from "./ColumnMapper";
import CsvReview from "./CsvReview";

// Define the expected CSV fields with labels and whether they're required.
const expectedFields = [
  { key: "date", label: "Date", required: true },
  { key: "category", label: "Category", required: true },
  { key: "item", label: "Item", required: true },
  { key: "vendor", label: "Vendor", required: true },
  { key: "cost", label: "Cost", required: true },
  { key: "quantity", label: "Quantity", required: true },
  { key: "description", label: "Description", required: false },
];

export default function ImportExpensesCSV() {
  // "upload" -> "mapping" -> "review"
  const [step, setStep] = useState("upload");
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  // We'll store the mapping object here (see below)
  const [mapping, setMapping] = useState(null);
  // Once we process the CSV with the mapping, store final rows here
  const [mappedRows, setMappedRows] = useState([]);

  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const navigate = useNavigate();

  // --- Step 1: File upload and parsing ---
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }
    setParsing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const headers = results.meta.fields || [];
          setCsvHeaders(headers);
          // Filter out rows that lack a Date value (adjust the field name if needed)
          const validRows = results.data.filter(
            (row) => row.Date && row.Date.trim() !== ""
          );
          setCsvData(validRows);
          // Initialize a mapping object – here we start with an empty mapping for each expected field.
          const initialMapping = expectedFields.reduce(
            (acc, field) => ({ ...acc, [field.key]: "" }),
            {}
          );
          setMapping(initialMapping);
          setStep("mapping");
          setParsing(false);
        } catch (err) {
          console.error("Error processing CSV:", err);
          toast.error("Failed to process CSV file.");
          setParsing(false);
        }
      },
      error: (error) => {
        console.error("PapaParse error:", error);
        toast.error("Error reading CSV file.");
        setParsing(false);
      },
    });
  };

  // --- Step 2: Column mapping ---
  // When ColumnMapper finishes, it returns a mapping object.
  const handleMappingComplete = (map) => {
    setMapping(map);
    // Now process each raw CSV row using the mapping object.
    const finalRows = csvData.map((row) => {
      const processedRow = {};
      expectedFields.forEach((field) => {
        // For each field, if the mapping value is a CSV header then use row[that header]
        // Otherwise, use the manual value (which we already replaced "Manual" with the manual text)
        processedRow[field.key] = map[field.key] in row ? row[map[field.key]] : map[field.key];
      });
      return processedRow;
    });
    setMappedRows(finalRows);
    setStep("review");
  };

  // --- Step 3: CSV Review and final submission ---
  const handleReviewSubmit = async (finalRows) => {
    try {
      const session = await fetchAuthSession();
      const userId = session.tokens.idToken.payload.sub;

      // Convert each row into an Expense object. Also, convert cost and quantity to numbers and compute totalCost.
      const newExpenses = finalRows.map((row) => {
        // Process date: assume row.date is a string (from input type="date")
        const date = row.date || "";
        // Process cost and quantity
        const unitCost = parseFloat((row.cost || "").replace(/[$,]/g, "")) || 0;
        const quantity = parseInt(row.quantity, 10) || 0;
        const totalCost = unitCost * quantity;

        return {
          userId,
          date,
          category: row.category || "",
          item: row.item || "",
          vendor: row.vendor || "",
          unitCost,
          quantity,
          totalCost,
          description: row.description || "",
          receiptImageKey: "",
        };
      });

      const savedItems = await Promise.all(
        newExpenses.map((exp) => DataStore.save(new Expense(exp)))
      );

      toast.success(`Successfully imported ${savedItems.length} expenses!`);
      navigate("/expenses");
    } catch (err) {
      console.error("Error saving to DataStore:", err);
      toast.error("Failed to save expenses.");
    }
  };

  const handleBackToUpload = () => {
    setStep("upload");
  };

  const handleBackToMapping = () => {
    setStep("mapping");
  };

  // --- Render based on step ---
  let content;
  if (step === "upload") {
    content = (
      <>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors cursor-pointer"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">

          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
          >
            {parsing ? "Importing..." : "Import CSV"}
          </Button>
        </div>
      </>
    );
  } else if (step === "mapping") {
    content = (
      <ColumnMapper
        csvHeaders={csvHeaders}
        expectedFields={expectedFields}
        rawCsvData={csvData}
        onMappingComplete={handleMappingComplete}
        onBack={handleBackToUpload}
      />
    );
  } else if (step === "review") {
    content = (
      <CsvReview mappedData={mappedRows} onSubmit={handleReviewSubmit} onBack={handleBackToMapping} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-8xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-center bg-white p-6 shadow-sm">
          <CloudUploadIcon className="w-16 h-16 text-blue-600 mb-3" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Import Expenses via CSV
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Your CSV should include columns: Date, Category, Item, Vendor, Cost, Quantity, Description.
          </p>
        </CardHeader>
        <CardContent className="bg-white px-8 py-6 space-y-6">
          {content}
        </CardContent>
      </Card>
    </div>
  );
}
