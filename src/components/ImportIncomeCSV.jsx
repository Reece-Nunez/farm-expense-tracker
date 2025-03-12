import React, { useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Income } from "@/models";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon } from "@heroicons/react/outline";
import ColumnMapper from "./ColumnMapper";
import CsvReviewIncome from "./CsvReviewIncome";

// Define the expected CSV fields for Income records.
const expectedFields = [
  { key: "date", label: "Date", required: true },
  { key: "item", label: "Item", required: true },
  { key: "quantity", label: "Quantity", required: true },
  { key: "price", label: "Price", required: true },
  { key: "paymentMethod", label: "Payment Method", required: true },
  { key: "notes", label: "Notes", required: false },
];

export default function ImportIncomeCSV() {
  const [step, setStep] = useState("upload"); // "upload" | "mapping" | "review"
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState(null);
  const [mappedRows, setMappedRows] = useState([]);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const navigate = useNavigate();

  // Step 1: File upload & CSV parsing
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
          // Filter out rows that lack a Date value (or are blank)
          const validRows = results.data.filter(
            (row) => row.Date && row.Date.trim() !== ""
          );
          setCsvData(validRows);
          // Initialize mapping object for each expected field as empty string.
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

  // Step 2: Handle column mapping complete from ColumnMapper
  const handleMappingComplete = (map) => {
    setMapping(map);
    // Process each CSV row using the mapping object.
    const finalRows = csvData.map((row) => {
      const processedRow = {};
      expectedFields.forEach((field) => {
        // If the mapping value exists as a key in the CSV row, use it; otherwise, use the manual value.
        processedRow[field.key] = map[field.key] in row ? row[map[field.key]] : map[field.key];
      });
      return processedRow;
    });
    setMappedRows(finalRows);
    setStep("review");
  };

  // Step 3: Review and final submission
  const handleReviewSubmit = async (finalRows) => {
    try {
      const session = await fetchAuthSession();
      const userId = session.tokens.idToken.payload.sub;

      // Process each row and compute the amount (quantity * price).
      const newIncomes = finalRows.map((row) => {
        // For date, assume the value is already a valid ISO date (or a string in YYYY-MM-DD format)
        const date = row.date || "";
        const quantity = parseInt(row.quantity, 10) || 0;
        const price = parseFloat((row.price || "").replace(/[$,]/g, "")) || 0;
        const amount = quantity * price;
        return {
          userId,
          date,
          item: row.item || "Other",
          quantity,
          price,
          amount,
          paymentMethod: row.paymentMethod || "",
          notes: row.notes || "",
        };
      });

      const savedItems = await Promise.all(
        newIncomes.map((inc) => DataStore.save(new Income(inc)))
      );
      toast.success(`Successfully imported ${savedItems.length} income records!`);
      navigate("/income");
    } catch (err) {
      console.error("Error saving Income to DataStore:", err);
      toast.error("Failed to save income records.");
    }
  };

  // Handle "Back" from ColumnMapper: return to file upload step.
  const handleBackToUpload = () => {
    setStep("upload");
  };

  const handleBackToMapping = () => {
    setStep("mapping")
  }

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
            className="block w-full text-sm text-gray-900
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-500 file:text-white
                    hover:file:bg-green-600 transition-colors cursor-pointer"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
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
      <CsvReviewIncome mappedData={mappedRows} onSubmit={handleReviewSubmit} onBack={handleBackToMapping} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-8xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-center bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-green-700 mb-3">
            Import Income via CSV
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Your CSV should include columns: Date, Item, Quantity, Price, Payment Method, Notes.
          </p>
        </CardHeader>
        <CardContent className="bg-white px-8 py-6 space-y-6">{content}</CardContent>
      </Card>
    </div>
  );
}
