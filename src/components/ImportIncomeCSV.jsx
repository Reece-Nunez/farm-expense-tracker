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

// Define your required fields
const expectedFields = [
  { key: "date", label: "Date", required: true },
  { key: "item", label: "Item", required: true },
  { key: "quantity", label: "Quantity", required: true },
  { key: "price", label: "Price", required: true },
  { key: "paymentMethod", label: "Payment Method", required: true },
  { key: "notes", label: "Notes", required: false },
];

export default function ImportIncomeCSV() {
  const [step, setStep] = useState("upload");
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState(null);
  const [mappedRows, setMappedRows] = useState([]);

  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const navigate = useNavigate();

  // Step 1: File upload & parsing
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

          const validRows = results.data.filter(
            (row) => row.Date || row.date
          );

          setCsvData(validRows);

          const initialMapping = expectedFields.reduce((acc, field) => {
            acc[field.key] = "";
            return acc;
          }, {});

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

  // Step 2: Column Mapper complete
  const handleMappingComplete = (map) => {
    setMapping(map);

    const processedRows = csvData.map((row) => {
      const mapped = {};
      expectedFields.forEach((field) => {
        const csvHeader = map[field.key];
        mapped[field.key] = csvHeader in row ? row[csvHeader] : map[field.key];
      });
      return mapped;
    });

    setMappedRows(processedRows);
    setStep("review");
  };

  // Step 3: Submit after Review
  const handleReviewSubmit = async (finalRows) => {
    try {
      const session = await fetchAuthSession();
      const userId = session.tokens.idToken.payload.sub;

      const incomesToSave = finalRows.map((row) => {
        const date = row.date || "";
        const quantity = parseInt(row.quantity, 10) || 0;

        // FIX: Ensure price is a string before using replace
        const priceString = typeof row.price === "string" ? row.price : String(row.price || "");
        const price = parseFloat(priceString.replace(/[$,]/g, "")) || 0;

        const amount = quantity * price;

        return {
          userId,
          date,
          item: row.item || "Other",
          quantity,
          price,
          amount,
          paymentMethod: row.paymentMethod || "Other",
          notes: row.notes || "",
        };
      });

      const saved = await Promise.all(
        incomesToSave.map((inc) => DataStore.save(new Income(inc)))
      );

      toast.success(`Successfully imported ${saved.length} income records!`);
      navigate("/income");
    } catch (err) {
      console.error("Error saving Income to DataStore:", err);
      toast.error("Failed to save income records.");
    }
  };

  const handleBackToUpload = () => setStep("upload");
  const handleBackToMapping = () => setStep("mapping");

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
      <CsvReviewIncome
        mappedData={mappedRows}
        onSubmit={handleReviewSubmit}
        onBack={handleBackToMapping}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-center bg-white p-6 shadow-sm">
          <CloudUploadIcon className="w-16 h-16 text-green-600 mb-3" />
          <h1 className="text-3xl font-extrabold text-green-700 mb-3">
            Import Income via CSV
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Your CSV should include: Date, Item, Quantity, Price, Payment Method, Notes.
          </p>
        </CardHeader>
        <CardContent className="bg-white px-8 py-6 space-y-6">{content}</CardContent>
      </Card>
    </div>
  );
}
