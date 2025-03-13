import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataStore } from "@aws-amplify/datastore";
import { Expense, Income } from "@/models";
import { toast } from "react-hot-toast";

export default function Reporting() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);

  const [filters, setFilters] = useState({
    category: "",
    vendor: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, expenses, incomes]);

  const fetchData = async () => {
    try {
      const allExpenses = await DataStore.query(Expense);
      const allIncomes = await DataStore.query(Income);
      setExpenses(allExpenses);
      setIncomes(allIncomes);
      setFilteredExpenses(allExpenses);
      setFilteredIncomes(allIncomes);
    } catch (error) {
      toast.error("Failed to fetch data.");
      console.error("Reporting fetch error:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: "", vendor: "", paymentMethod: "", startDate: "", endDate: "" });
  };

  const applyFilters = () => {
    const { category, vendor, paymentMethod, startDate, endDate } = filters;

    const expFiltered = expenses.filter((exp) => {
      const dateCheck = (!startDate || new Date(exp.date) >= new Date(startDate)) &&
                        (!endDate || new Date(exp.date) <= new Date(endDate));
      const categoryCheck = !category || exp.lineItems?.some(li => li.category === category);
      const vendorCheck = !vendor || exp.vendor === vendor;
      return dateCheck && categoryCheck && vendorCheck;
    });

    const incFiltered = incomes.filter((inc) => {
      const dateCheck = (!startDate || new Date(inc.date) >= new Date(startDate)) &&
                        (!endDate || new Date(inc.date) <= new Date(endDate));
      const paymentCheck = !paymentMethod || inc.paymentMethod === paymentMethod;
      return dateCheck && paymentCheck;
    });

    setFilteredExpenses(expFiltered);
    setFilteredIncomes(incFiltered);
  };

  const uniqueVendors = [...new Set(expenses.map(e => e.vendor))];
  const uniqueCategories = [...new Set(expenses.flatMap(e => e.lineItems?.map(li => li.category) || []))];
  const uniquePaymentMethods = [...new Set(incomes.map(i => i.paymentMethod))];

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
      <CardHeader className="text-3xl font-bold text-center mb-6">
        Reporting & Filters
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Select name="vendor" value={filters.vendor} onChange={handleFilterChange}>
            <option value="">All Vendors</option>
            {uniqueVendors.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>

          <Select name="paymentMethod" value={filters.paymentMethod} onChange={handleFilterChange}>
            <option value="">All Payment Methods</option>
            {uniquePaymentMethods.map((pm) => (
              <option key={pm} value={pm}>{pm}</option>
            ))}
          </Select>

          <Input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          <Input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>

        <div className="flex justify-end gap-4 mb-8">
          <Button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Apply Filters</Button>
          <Button onClick={clearFilters} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Clear Filters</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-lg shadow p-4">
            <h3 className="text-xl font-bold mb-4">Filtered Expenses ({filteredExpenses.length})</h3>
            <ul className="space-y-4">
              {filteredExpenses.map((exp) => (
                <li key={exp.id} className="border rounded-lg p-4 shadow hover:shadow-md">
                  <p className="font-semibold">Date: {new Date(exp.date).toLocaleDateString()}</p>
                  <p>Vendor: {exp.vendor}</p>
                  <p>
                    Categories: {exp.lineItems?.map(li => li.category).join(", ") || "-"}
                  </p>
                  <p>Total: ${exp.grandTotal?.toFixed(2) || "0.00"}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg shadow p-4">
            <h3 className="text-xl font-bold mb-4">Filtered Income ({filteredIncomes.length})</h3>
            <ul className="space-y-4">
              {filteredIncomes.map((inc) => (
                <li key={inc.id} className="border rounded-lg p-4 shadow hover:shadow-md">
                  <p className="font-semibold">Date: {new Date(inc.date).toLocaleDateString()}</p>
                  <p>Item: {inc.item}</p>
                  <p>Quantity: {inc.quantity}</p>
                  <p>Price: ${inc.price?.toFixed(2)}</p>
                  <p>Amount: ${inc.amount?.toFixed(2)}</p>
                  <p>Payment Method: {inc.paymentMethod || "-"}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}