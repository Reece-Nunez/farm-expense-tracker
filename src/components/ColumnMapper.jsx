import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function ColumnMapper({
  csvHeaders = [],
  expectedFields = [],
  onMappingComplete,
  onBack,
}) {
  const [columnMap, setColumnMap] = useState(
    expectedFields.reduce((acc, field) => {
      acc[field.key] = "";
      return acc;
    }, {})
  );

  const [manualValues, setManualValues] = useState({});

  const handleSelectChange = (fieldKey, value) => {
    setColumnMap({ ...columnMap, [fieldKey]: value });
    if (value !== "Manual") {
      setManualValues({ ...manualValues, [fieldKey]: "" });
    }
  };

  const handleManualChange = (fieldKey, val) => {
    setManualValues({ ...manualValues, [fieldKey]: val });
  };

  const handleContinue = () => {
    try {
      const finalMapping = { ...columnMap };
      expectedFields.forEach((field) => {
        if (finalMapping[field.key] === "Manual") {
          finalMapping[field.key] = manualValues[field.key] || "";
        }
      });
      onMappingComplete(finalMapping);
    } catch (err) {
      console.error("ColumnMapper handleContinue error:", err);
      toast.error("Failed to map CSV data.");
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow space-y-4 max-w-2xl w-full mx-auto">
      <h2 className="text-xl font-semibold">Map CSV Columns</h2>
      <p className="text-sm text-gray-600">
        Map CSV columns to fields or enter manual values.
      </p>

      {expectedFields.map((field) => {
        const fieldKey = field.key;
        const chosen = columnMap[fieldKey];
        return (
          <div key={fieldKey} className="mb-4">
            <label className="block font-medium mb-1">{field.label}</label>
            <Select
              value={chosen}
              onChange={(e) => handleSelectChange(fieldKey, e.target.value)}
              className="w-full mb-2"
            >
              <option value="">-- Select an option --</option>
              <option value="Manual">Manual Input</option>
              {csvHeaders.map((hdr) => (
                <option key={hdr} value={hdr}>
                  {hdr}
                </option>
              ))}
            </Select>
            {chosen === "Manual" && (
              <Input
                type="text"
                placeholder={`Enter ${field.label}`}
                value={manualValues[fieldKey] || ""}
                onChange={(e) => handleManualChange(fieldKey, e.target.value)}
                className="w-full"
              />
            )}
          </div>
        );
      })}

      <div className="flex justify-between mt-6">
        <Button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">
          Back
        </Button>
        <Button onClick={handleContinue} className="bg-blue-600 text-white px-4 py-2 rounded">
          Continue
        </Button>
      </div>
    </div>
  );
}
