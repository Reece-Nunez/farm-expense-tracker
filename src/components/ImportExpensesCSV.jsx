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

import ColumnMapper from "./ColumnMapper";
import CsvReview from "./CsvReview";

const expectedFields = [
  { key: "date", label: "Date", required: true },
  { key: "vendor", label: "Vendor", required: true },
  { key: "category", label: "Category", required: true },
  { key: "item", label: "Item", required: true },
  { key: "cost", label: "Unit Cost", required: true },
  { key: "quantity", label: "Quantity", required: true },
  { key: "description", label: "Description", required: false }
];

export default function ImportExpensesCSV() {
  const [step, setStep] = useState("upload");
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState(null);
  const [mappedRows, setMappedRows] = useState([]);

  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  // Handle initial CSV import + parsing
  const handleImport = () => {
    if (!file) {
      toast.error("Please select a CSV file.");
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
            (row) => row.Date || row.date // just in case headers differ
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
          toast.error("Failed to process CSV.");
          setParsing(false);
        }
      },
      error: (error) => {
        console.error("PapaParse error:", error);
        toast.error("Error reading CSV.");
        setParsing(false);
      }
    });
  };

  // Handle column mapping complete
  const handleMappingComplete = (map) => {
    setMapping(map);

    const processedRows = csvData.map((row) => {
      const mapped = {};
      expectedFields.forEach((field) => {
        const csvHeader = map[field.key];
        mapped[field.key] = csvHeader in row ? row[csvHeader] : csvHeader;
      });
      return mapped;
    });

    setMappedRows(processedRows);
    setStep("review");
  };

  // Group line items into expenses based on date + vendor
  const groupLineItemsToExpenses = (rows, userId) => {
    const grouped = {};

    rows.forEach((row) => {
      const groupKey = `${row.date}_${row.vendor}`;

      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          userId,
          date: row.date,
          vendor: row.vendor,
          description: row.description || "",
          receiptImageKey: "", // assuming no image import in CSV
          lineItems: []
        };
      }

      const unitCost = parseFloat((row.cost || "").replace(/[$,]/g, "")) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const lineTotal = unitCost * quantity;

      grouped[groupKey].lineItems.push({
        category: row.category,
        item: row.item,
        unitCost,
        quantity,
        lineTotal
      });
    });

    // After grouping, calculate grandTotal for each expense
    return Object.values(grouped).map((expense) => {
      const grandTotal = expense.lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
      return { ...expense, grandTotal };
    });
  };

  // Handle review submit (saving data to DataStore)
  const handleReviewSubmit = async (finalRows) => {
    try {
      const session = await fetchAuthSession();
      const userId = session.tokens.idToken.payload.sub;

      const expensesToSave = groupLineItemsToExpenses(finalRows, userId);

      const saved = await Promise.all(
        expensesToSave.map((exp) => DataStore.save(new Expense(exp)))
      );

      toast.success(`Imported ${saved.length} expenses!`);
      navigate("/dashboard/expenses");
    } catch (err) {
      console.error("Error saving expenses:", err);
      toast.error("Failed to save expenses.");
    }
  };

  // Back handlers
  const handleBackToUpload = () => setStep("upload");
  const handleBackToMapping = () => setStep("mapping");

  // Steps
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
        <div className="flex justify-center gap-4 mt-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {parsing ? "Importing..." : "Import CSV"}
          </Button>
        </div>
      </>
    );
  }

  if (step === "mapping") {
    content = (
      <ColumnMapper
        csvHeaders={csvHeaders}
        expectedFields={expectedFields}
        onMappingComplete={handleMappingComplete}
        onBack={handleBackToUpload}
      />
    );
  }

  if (step === "review") {
    content = (
      <CsvReview
        mappedData={mappedRows}
        onSubmit={handleReviewSubmit}
        onBack={handleBackToMapping}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center bg-white p-6 shadow-sm">
          <CloudUploadIcon className="w-16 h-16 text-blue-600 mb-3" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Import Expenses via CSV
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            CSV must include Date, Vendor, Category, Item, Cost, Quantity, Description (optional)
          </p>
        </CardHeader>
        <CardContent className="bg-white px-8 py-6 space-y-6">{content}</CardContent>
      </Card>
    </div>
  );
}
