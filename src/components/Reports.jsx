import React, { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Expense, Income } from "@/models";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    vendor: "",
    paymentMethod: "",
    item: "",
  });

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const expenses = await DataStore.query(Expense);
      const incomes = await DataStore.query(Income);

      setExpenses(expenses);
      setIncomes(incomes);
      setFilteredExpenses(expenses);
      setFilteredIncomes(incomes);
    };
    fetchData();
  }, []);

  const applyFilters = () => {
    let filteredExp = expenses.filter(exp => {
      const inDateRange =
        (!filters.dateFrom || new Date(exp.date) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(exp.date) <= new Date(filters.dateTo));
      const matchesCategory = !filters.category || exp.lineItems?.some(li => li.category === filters.category);
      const matchesVendor = !filters.vendor || exp.vendor?.includes(filters.vendor);

      return inDateRange && matchesCategory && matchesVendor;
    });

    let filteredInc = incomes.filter(inc => {
      const inDateRange =
        (!filters.dateFrom || new Date(inc.date) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(inc.date) <= new Date(filters.dateTo));
      const matchesItem = !filters.item || inc.item?.includes(filters.item);
      const matchesPaymentMethod = !filters.paymentMethod || inc.paymentMethod === filters.paymentMethod;

      return inDateRange && matchesItem && matchesPaymentMethod;
    });

    setFilteredExpenses(filteredExp);
    setFilteredIncomes(filteredInc);
  };

  const exportCSV = () => {
    const expenseData = filteredExpenses.map(exp => ({
      Date: exp.date,
      Vendor: exp.vendor,
      Category: exp.lineItems?.map(li => li.category).join(", "),
      GrandTotal: exp.grandTotal?.toFixed(2),
      Description: exp.description,
    }));

    const incomeData = filteredIncomes.map(inc => ({
      Date: inc.date,
      Item: inc.item,
      Quantity: inc.quantity,
      Price: inc.price?.toFixed(2),
      Amount: inc.amount?.toFixed(2),
      PaymentMethod: inc.paymentMethod,
      Notes: inc.notes,
    }));

    const csvRows = [
      "Expenses",
      ["Date", "Vendor", "Category", "Grand Total", "Description"].join(","),
      ...expenseData.map(row => Object.values(row).join(",")),
      "",
      "Income",
      ["Date", "Item", "Quantity", "Price", "Amount", "Payment Method", "Notes"].join(","),
      ...incomeData.map(row => Object.values(row).join(",")),
    ];

    const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    saveAs(csvBlob, "report.csv");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Harvest Hub Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Vendor", "Category", "Grand Total", "Description"]],
      body: filteredExpenses.map(exp => [
        exp.date,
        exp.vendor,
        exp.lineItems?.map(li => li.category).join(", "),
        `$${exp.grandTotal?.toFixed(2)}`,
        exp.description || ""
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Date", "Item", "Quantity", "Price", "Amount", "Payment", "Notes"]],
      body: filteredIncomes.map(inc => [
        inc.date,
        inc.item,
        inc.quantity,
        `$${inc.price?.toFixed(2)}`,
        `$${inc.amount?.toFixed(2)}`,
        inc.paymentMethod,
        inc.notes || ""
      ]),
    });

    doc.save("report.pdf");
  };

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
      <CardHeader className="text-2xl font-bold text-center mb-4">Reports</CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder="From Date"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
            placeholder="To Date"
          />
          <Select
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Filter Category (Expenses)</option>
            <option value="Chemicals">Chemicals</option>
            <option value="Seeds and Plants">Seeds and Plants</option>
            {/* Add more categories */}
          </Select>
          <Input
            type="text"
            value={filters.vendor}
            onChange={e => setFilters({ ...filters, vendor: e.target.value })}
            placeholder="Vendor (Expenses)"
          />

          <Input
            type="text"
            value={filters.item}
            onChange={e => setFilters({ ...filters, item: e.target.value })}
            placeholder="Item (Income)"
          />
          <Select
            value={filters.paymentMethod}
            onChange={e => setFilters({ ...filters, paymentMethod: e.target.value })}
          >
            <option value="">Filter Payment Method (Income)</option>
            <option value="Cash">Cash</option>
            <option value="Venmo">Venmo</option>
            {/* Add more methods */}
          </Select>
        </div>

        <div className="flex justify-end gap-4 mb-6">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button onClick={exportCSV} className="bg-green-600 hover:bg-green-700">
            Export CSV
          </Button>
          <Button onClick={exportPDF} className="bg-red-600 hover:bg-red-700">
            Export PDF
          </Button>
        </div>

        <h2 className="text-xl font-bold mb-2">Filtered Expenses ({filteredExpenses.length})</h2>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Vendor</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Grand Total</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-2">{exp.date}</td>
                  <td className="border p-2">{exp.vendor}</td>
                  <td className="border p-2">{exp.lineItems?.map(li => li.category).join(", ")}</td>
                  <td className="border p-2">${exp.grandTotal?.toFixed(2)}</td>
                  <td className="border p-2">{exp.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold mb-2">Filtered Income ({filteredIncomes.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Payment Method</th>
                <th className="border p-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((inc, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-2">{inc.date}</td>
                  <td className="border p-2">{inc.item}</td>
                  <td className="border p-2">{inc.quantity}</td>
                  <td className="border p-2">${inc.price?.toFixed(2)}</td>
                  <td className="border p-2">${inc.amount?.toFixed(2)}</td>
                  <td className="border p-2">{inc.paymentMethod}</td>
                  <td className="border p-2">{inc.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
