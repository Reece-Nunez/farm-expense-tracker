// EditIncome.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Income } from "../models";
import IncomeForm from "./IncomeForm";
import { toast } from "react-hot-toast";

export default function EditIncome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incomeFormRef = useRef(null);
  const [currentIncome, setCurrentIncome] = useState(null);

  useEffect(() => {
    const fetchIncomeById = async () => {
      try {
        const found = await DataStore.query(Income, id);
        if (!found) {
          toast.error("Income record not found!");
          navigate("/income");
          return;
        }
        setCurrentIncome(found);
      } catch (error) {
        toast.error("Error fetching income record.");
        console.error("[EditIncome] fetch error:", error);
      }
    };
    fetchIncomeById();
  }, [id, navigate]);

  const handleUpdateIncome = async (formData) => {
    try {
      const updated = await DataStore.save(
        Income.copyOf(currentIncome, (updated) => {
          Object.assign(updated, formData);
        })
      );
      toast.success("Income updated successfully!");
      navigate("/income");
    } catch (error) {
      console.error("[EditIncome] update error:", error);
      toast.error("Failed to update income.");
    }
  };

  if (!currentIncome) {
    return <div style={{ padding: 20 }}>Loading income record...</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h2 className="text-xl mb-4">Edit Income</h2>
      <IncomeForm
        ref={incomeFormRef}
        editingIncome={currentIncome}
        onValidSubmit={handleUpdateIncome}
      />
    </div>
  );
}
