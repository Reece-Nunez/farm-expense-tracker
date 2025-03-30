// EditIncome.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Income } from "../models";
import IncomeForm from "./IncomeForm";
import { toast } from "react-hot-toast";
import GenericModal from "./GenericModal";

export default function EditIncome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incomeFormRef = useRef(null);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});

  useEffect(() => {
    const fetchIncomeById = async () => {
      try {
        const found = await DataStore.query(Income, id);
        if (!found) {
          toast.error("Income record not found!");
          navigate("/dashboard/income");
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

  // Instead of updating immediately, we prompt the user for confirmation.
  const handleUpdateIncome = async (formData) => {
    setConfirmMessage("Are you sure you want to update this income?");
    setConfirmAction(() => async () => {
      try {
        const updated = await DataStore.save(
          Income.copyOf(currentIncome, (updated) => {
            Object.assign(updated, formData);
          })
        );
        toast.success("Income updated successfully!");
        navigate("/dashboard/income");
      } catch (error) {
        console.error("[EditIncome] update error:", error);
        toast.error("Failed to update income.");
      } finally {
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  if (!currentIncome) {
    return <div className="p-8 text-center">Loading income record...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Income</h2>
        <IncomeForm
          ref={incomeFormRef}
          editingIncome={currentIncome}
          onValidSubmit={handleUpdateIncome}
        />
      </div>
      {showConfirm && (
        <GenericModal
          isOpen={showConfirm}
          onRequestClose={() => setShowConfirm(false)}
          onConfirm={confirmAction}
          title="Confirm Update"
          message={confirmMessage}
        />
      )}
    </div>
  );
}
