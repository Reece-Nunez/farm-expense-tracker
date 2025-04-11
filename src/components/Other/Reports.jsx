import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listExpenses, listIncomes, listLineItems } from "@/graphql/queries";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  const client = generateClient();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      try {
        const [expenseRes, incomeRes] = await Promise.all([
          client.graphql({
            query: listExpenses,
            variables: {
              filter: { userId: { eq: user.id } },
              limit: 1000,
            },
          }).then(res => res.data.listExpenses.items),

          client.graphql({
            query: listIncomes,
            variables: {
              filter: { userId: { eq: user.id } },
              limit: 1000,
            },
          }).then(res => res.data.listIncomes.items),
        ]);

        // 🧠 Fetch and attach line items to each expense
        const enrichedExpenses = await Promise.all(
          expenseRes.map(async (expense) => {
            const lineItemRes = await client.graphql({
              query: listLineItems,
              variables: {
                filter: { expenseID: { eq: expense.id } },
                limit: 1000,
              },
            });

            const lineItems = lineItemRes.data.listLineItems.items;
            return { ...expense, lineItems };
          })
        );

        const sortedExp = enrichedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        const sortedInc = incomeRes.sort((a, b) => new Date(b.date) - new Date(a.date));

        setExpenses(sortedExp);
        setIncomes(sortedInc);
        setFilteredExpenses(sortedExp);
        setFilteredIncomes(sortedInc);
      } catch (err) {
        console.error("[Reports] fetchData error:", err);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    const filteredExp = expenses.filter((exp) => {
      const inDateRange =
        (!filters.dateFrom || new Date(exp.date) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(exp.date) <= new Date(filters.dateTo));

      const matchesCategory =
        !filters.category || exp.lineItems?.some((li) => li.category === filters.category);

      const matchesVendor =
        !filters.vendor || exp.vendor?.toLowerCase().includes(filters.vendor.toLowerCase());

      return inDateRange && matchesCategory && matchesVendor;
    });

    const filteredInc = incomes.filter((inc) => {
      const inDateRange =
        (!filters.dateFrom || new Date(inc.date) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(inc.date) <= new Date(filters.dateTo));

      const matchesItem =
        !filters.item || inc.item?.toLowerCase() === filters.item.toLowerCase();

      const matchesPaymentMethod =
        !filters.paymentMethod || inc.paymentMethod === filters.paymentMethod;

      return inDateRange && matchesItem && matchesPaymentMethod;
    });

    filteredExp.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredInc.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredExpenses(filteredExp);
    setFilteredIncomes(filteredInc);
  };

  const exportCSV = () => {
    const expenseData = filteredExpenses.map((exp) => ({
      Date: exp.date,
      Vendor: exp.vendor,
      Category: exp.lineItems?.map((li) => li.category).join(", "),
      GrandTotal: exp.grandTotal?.toFixed(2),
      Description: exp.description,
    }));

    const incomeData = filteredIncomes.map((inc) => ({
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
      ...expenseData.map((row) => Object.values(row).join(",")),
      "",
      "Income",
      ["Date", "Item", "Quantity", "Price", "Amount", "Payment Method", "Notes"].join(","),
      ...incomeData.map((row) => Object.values(row).join(",")),
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
      body: filteredExpenses.map((exp) => [
        exp.date,
        exp.vendor,
        exp.lineItems?.map((li) => li.category).join(", "),
        `$${exp.grandTotal?.toFixed(2)}`,
        exp.description || "",
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Date", "Item", "Quantity", "Price", "Amount", "Payment", "Notes"]],
      body: filteredIncomes.map((inc) => [
        inc.date,
        inc.item,
        inc.quantity,
        `$${inc.price?.toFixed(2)}`,
        `$${inc.amount?.toFixed(2)}`,
        inc.paymentMethod,
        inc.notes || "",
      ]),
    });

    doc.save("report.pdf");
  };

  return (
    <Card className="max-w-7xl mx-auto p-4 sm:p-6 mb-6 shadow-lg">
      <CardHeader className="text-2xl font-bold text-center mb-4">
        Reports
      </CardHeader>
      <CardContent>
        {/* FILTER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {/* Date range */}
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder="From Date"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            placeholder="To Date"
          />

          {/* Expense Filters */}
          <Select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">Filter Category (Expenses)</option>
            <option value="Chemicals">Chemicals</option>
            <option value="Seeds and Plants">Seeds and Plants</option>
            <option value="Conservation Expenses">Conservation Expenses</option>
            <option value="Custom Hire">Custom Hire</option>
            <option value="Feed Purchased">Feed Purchased</option>
            <option value="Fertilizers and Lime">Fertilizers and Lime</option>
            <option value="Freight and Trucking">Freight and Trucking</option>
            <option value="Gasoline, Fuel, and Oil">Gasoline, Fuel, and Oil</option>
            <option value="Mortgage Interest">Mortgage Interest</option>
            <option value="Insurance (Not Health)">
              Insurance (Not Health)
            </option>
            <option value="Other Interest">Other Interest</option>
            <option value="Equipment Rental">Equipment Rental</option>
            <option value="Other Rental">Other Rental</option>
            <option value="Repairs and Maintenance">
              Repairs and Maintenance
            </option>
            <option value="Storage and Warehousing">
              Storage and Warehousing
            </option>
            <option value="Supplies Purchased">Supplies Purchased</option>
            <option value="Taxes">Taxes</option>
            <option value="Utilities">Utilities</option>
            <option value="Vet">Vet</option>
            <option value="Breeding">Breeding</option>
            <option value="Medicine">Medicine</option>
          </Select>

          <Input
            type="text"
            value={filters.vendor}
            onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
            placeholder="Vendor (Expenses)"
          />

          {/* Income Filters */}
          <Select
            value={filters.item}
            onChange={(e) => setFilters({ ...filters, item: e.target.value })}
          >
            <option value="">Filter Item Sold (Income)</option>
            <option value="Eggs">Eggs</option>
            <option value="Beef">Beef</option>
            <option value="Pork">Pork</option>
            <option value="Other">Other</option>
          </Select>

          <Select
            value={filters.paymentMethod}
            onChange={(e) =>
              setFilters({ ...filters, paymentMethod: e.target.value })
            }
          >
            <option value="">Filter Payment Method (Income)</option>
            <option value="Cash">Cash</option>
            <option value="Venmo">Venmo</option>
            <option value="Checks">Checks</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mb-6">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700"
          >
            Export CSV
          </Button>
          <Button
            onClick={exportPDF}
            className="bg-red-600 hover:bg-red-700"
          >
            Export PDF
          </Button>
        </div>

        {/* EXPENSES TABLE */}
        <h2 className="text-xl font-bold mb-2">
          Filtered Expenses ({filteredExpenses.length})
        </h2>

        {/* 
  1) MOBILE VIEW: Card layout 
     "block" on small screens, "hidden" on md+ 
*/}
        <div className="block md:hidden">
          {filteredExpenses.map((exp, idx) => (
            <div key={idx} className="border rounded mb-4 p-3 bg-white shadow-sm">
              <p className="font-semibold">Date: <span className="font-normal">{exp.date}</span></p>
              <p className="font-semibold">Vendor: <span className="font-normal">{exp.vendor}</span></p>
              <p className="font-semibold">Categories:
                <span className="font-normal">
                  {[...new Set(exp.lineItems?.map((li) => li.category))].join(", ")}
                </span>
              </p>

              <p className="font-semibold">Grand Total:
                <span className="font-normal">
                  ${exp.grandTotal?.toFixed(2)}
                </span>
              </p>
              <p className="font-semibold">Description:
                <span className="font-normal">
                  {exp.description}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* 
  2) DESKTOP VIEW: Standard table "hidden" on small screens, "block" on md+ */}
        <div className="hidden md:block overflow-x-auto w-full mb-6">
          <table className="table-auto w-full border-collapse text-sm">
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
                <React.Fragment key={exp.id}>
                  <tr
                    onClick={() => toggleRow(exp.id)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="border p-2">{exp.date}</td>
                    <td className="border p-2">{exp.vendor}</td>
                    <td className="border p-2">
                      {[...new Set(exp.lineItems?.map((li) => li.category))].join(", ")}
                    </td>
                    <td className="border p-2">${exp.grandTotal?.toFixed(2)}</td>
                    <td className="border p-2">{exp.description}</td>
                  </tr>
                  {expandedRows[exp.id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-3">
                        <div className="text-sm">
                          <p className="font-bold mb-2">Line Items:</p>
                          <table className="table-auto w-full text-xs">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="border px-2 py-1">Item</th>
                                <th className="border px-2 py-1">Category</th>
                                <th className="border px-2 py-1">Quantity</th>
                                <th className="border px-2 py-1">Unit Cost</th>
                                <th className="border px-2 py-1">Line Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exp.lineItems?.map((li, i) => (
                                <tr key={i}>
                                  <td className="border px-2 py-1">{li.item}</td>
                                  <td className="border px-2 py-1">{li.category}</td>
                                  <td className="border px-2 py-1">{li.quantity}</td>
                                  <td className="border px-2 py-1">
                                    ${li.unitCost?.toFixed(2)}
                                  </td>
                                  <td className="border px-2 py-1">
                                    ${li.lineTotal?.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* INCOME TABLE */}
        <h2 className="text-xl font-bold mb-2">
          Filtered Income ({filteredIncomes.length})
        </h2>

        {/* MOBILE card list */}
        <div className="block md:hidden">
          {filteredIncomes.map((inc, idx) => (
            <div key={idx} className="border rounded mb-4 p-3 bg-white shadow-sm">
              <p className="font-semibold">
                Date: <span className="font-normal">{inc.date}</span>
              </p>
              <p className="font-semibold">
                Item: <span className="font-normal">{inc.item}</span>
              </p>
              <p className="font-semibold">
                Quantity: <span className="font-normal">{inc.quantity}</span>
              </p>
              <p className="font-semibold">
                Price: <span className="font-normal">${inc.price?.toFixed(2)}</span>
              </p>
              <p className="font-semibold">
                Amount: <span className="font-normal">${inc.amount?.toFixed(2)}</span>
              </p>
              <p className="font-semibold">
                Payment Method:{" "}
                <span className="font-normal">{inc.paymentMethod}</span>
              </p>
              <p className="font-semibold">
                Notes: <span className="font-normal">{inc.notes}</span>
              </p>
            </div>
          ))}
        </div>

        {/* DESKTOP table */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse text-sm">
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
                  <td className="border p-2 whitespace-normal break-words max-w-xs">
                    {inc.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>      </CardContent>
    </Card>
  );
}
