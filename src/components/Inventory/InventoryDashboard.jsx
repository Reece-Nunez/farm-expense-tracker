import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { generateClient } from "aws-amplify/api";
import {
  listLivestocks,
  listChickenFlocks,
  listFields,
  listInventoryItems,
  listEggLogs,
  listLineItems,
  getExpense,
} from "../../graphql/queries";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import {
  faCow,
  faEgg,
  faTractor,
  faFaceLaughBeam,
  faMap,
  faWheatAwn,
  faCrow,
  faChartLine,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, getWeek, isValid } from "date-fns";
import Modal from "../Util/Modal";
import { createEggLog as createEggLogMutation } from "@/graphql/mutations";
import { createLivestock as createLivestockMutation } from "@/graphql/mutations";
import { Button } from "@/components/ui/button";

const CHICKEN_FEED_KEYWORDS = [
  "chicken feed",
  "poultry grain",
  "laying pellets",
  "scratch",
  "hens feed",
  "layer pellet",
];

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    livestock: 0,
    livestockBySpecies: {},
    chickens: 0,
    fields: 0,
    totalAcres: 0,
    fieldAcreage: [],
    fieldUtilization: [],
    eggsPerDay: {},
    items: [],
  });
  const [view, setView] = useState("day");
  const formatted = format(parseISO("2024-04-20"), "MM-dd-yyyy");
  const [selectedType, setSelectedType] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedExpenses, setFeedExpenses] = useState([]);
  const [eggLogs, setEggLogs] = useState([]);
  const [showEggModal, setShowEggModal] = useState(false);
  const [eggForm, setEggForm] = useState({
    flockId: "",
    date: "",
    eggsCollected: "",
  });
  const [showSuppliesModal, setShowSuppliesModal] = useState(false);
  const [suppliesForm, setSuppliesForm] = useState({
    name: "",
    description: "",
    category: "FEED_NUTRITION",
    location: "MAIN_STORAGE",
    currentStock: 0,
    minimumStock: 0,
    unit: "PIECES",
    unitCost: 0,
  });
  const [flocks, setFlocks] = useState([]);
  const [showLivestockModal, setShowLivestockModal] = useState(false);
  const [livestockForm, setLivestockForm] = useState({
    name: "",
    species: "",
    breed: "",
    birthdate: "",
    weight: "",
    gender: "",
    locationId: "",
    status: "",
    notes: "",
  });
  const [livestock, setLivestock] = useState([]);
  const [parentIDs, setParentIDs] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const user = await getCurrentUser();
      const sub = user?.attributes?.sub || user?.sub;

      if (!sub) {
        console.warn("No user sub found – skipping analytics fetch.");
        return;
      }

      const client = generateClient();

      const [
        livestockData,
        chickensData,
        fieldsData,
        itemsData,
        eggLogsData,
        lineItemsData,
      ] = await Promise.all([
        client.graphql({
          query: listLivestocks,
          variables: { filter: { sub: { eq: sub } }, limit: 1000 },
        }),
        client.graphql({
          query: listChickenFlocks,
          variables: { filter: { sub: { eq: sub } }, limit: 1000 },
        }),
        client.graphql({
          query: listFields,
          variables: { filter: { sub: { eq: sub } }, limit: 1000 },
        }),
        client.graphql({
          query: listInventoryItems,
          variables: { filter: { sub: { eq: sub } }, limit: 1000 },
        }),
        client.graphql({
          query: listEggLogs,
          variables: { filter: { sub: { eq: sub } }, limit: 1000 },
        }),
        client.graphql({
          query: listLineItems,
          variables: { filter: { sub: { eq: sub } }, limit: 1000 },
        }),
      ]);

      const eggLogs = eggLogsData?.data?.listEggLogs?.items || [];
      setEggLogs(eggLogs);

      const feedLines = lineItemsData.data.listLineItems.items.filter((item) =>
        CHICKEN_FEED_KEYWORDS.some((keyword) =>
          item.item?.toLowerCase().includes(keyword)
        )
      );

      const detailedFeedExpenses = [];
      for (const item of feedLines) {
        const { data } = await client.graphql({
          query: getExpense,
          variables: { id: item.expenseID },
        });
        if (data.getExpense) {
          detailedFeedExpenses.push({
            date: data.getExpense.date,
            cost: item.lineTotal,
          });
        }
      }
      setFeedExpenses(detailedFeedExpenses);

      const livestock = livestockData?.data?.listLivestocks?.items || [];
      const chickens = chickensData?.data?.listChickenFlocks?.items || [];
      const fields = fieldsData?.data?.listFields?.items || [];
      const items = itemsData?.data?.listInventoryItems?.items || [];

      const livestockBySpecies = livestock.reduce((acc, l) => {
        acc[l.species] = (acc[l.species] || 0) + 1;
        return acc;
      }, {});

      const totalAcres = fields.reduce(
        (sum, field) => sum + (field.acres || 0),
        0
      );
      const fieldAcreage = fields.map((f) => ({
        name: f.name,
        acres: f.acres || 0,
      }));
      const fieldUtilization = fields.map((f) => {
        const count = livestock.filter((l) => l.fieldID === f.id).length;
        return { name: f.name, acres: f.acres || 0, livestockCount: count };
      });

      const eggsPerDay = eggLogs.reduce((acc, log) => {
        acc[log.date] = (acc[log.date] || 0) + (log.eggsCollected || 0);
        return acc;
      }, {});

      setAnalytics({
        livestock: livestock.length,
        livestockBySpecies,
        chickens: chickensData?.data?.listChickenFlocks?.items.length || 0,
        fields: fields.length,
        totalAcres,
        fieldAcreage,
        fieldUtilization,
        eggsPerDay,
        items: items,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const inventoryTypes = useMemo(() => {
    const uniqueTypes = [...new Set(analytics.items.map((item) => item.type))];
    return ["All", ...uniqueTypes];
  }, [analytics.items]);

  const filteredItems = useMemo(() => {
    const items = [...analytics.items].sort((a, b) => a.quantity - b.quantity);
    return selectedType === "All"
      ? items
      : items.filter((item) => item.type === selectedType);
  }, [analytics.items, selectedType]);

  const fetchLivestockAndFlocks = async () => {
    const user = await getCurrentUser();
    const client = generateClient();

    const [flocksData, livestockData] = await Promise.all([
      client.graphql({
        query: listChickenFlocks,
        variables: { filter: { sub: { eq: user.sub } }, limit: 1000 },
      }),
      client.graphql({
        query: listLivestocks,
        variables: { filter: { sub: { eq: user.sub } }, limit: 1000 },
      }),
    ]);

    setFlocks(flocksData.data.listChickenFlocks.items);
    setLivestock(livestockData.data.listLivestocks.items);
  };

  const handleSubmitEggLog = async () => {
    const user = await getCurrentUser();
    const client = generateClient();
    try {
      await client.graphql({
        query: createEggLogMutation,
        variables: {
          input: {
            chickenFlockID: eggForm.flockId,
            date: eggForm.date,
            eggsCollected: parseInt(eggForm.eggsCollected),
            sub: user.sub,
          },
        },
      });

      // Clear form + close modal
      setEggForm({ flockId: "", date: "", eggsCollected: "" });
      setShowEggModal(false);

      // 👇 Refresh dashboard analytics after submission
      fetchAnalytics();
    } catch (err) {
      console.error("Failed to log egg:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSubmitLivestock = async () => {
    const user = await getCurrentUser();
    const client = generateClient();

    try {
      const { data } = await client.graphql({
        query: createLivestockMutation,
        variables: {
          input: {
            ...livestockForm,
            weight: parseFloat(livestockForm.weight),
            sub: user.sub,
            fieldID: livestockForm.locationId || null,
            status: livestockForm.status || "Active",
          },
        },
      });

      const savedId = data.createLivestock.id;

      // 🔗 Create parent links if any were selected
      await Promise.all(
        parentIDs.map((parentId) =>
          client.graphql({
            query: createLivestockFamily,
            variables: {
              input: {
                parentID: parentId,
                childID: savedId,
                sub: user.sub,
              },
            },
          })
        )
      );

      // 🧼 Reset state
      setParentIDs([]);
      setLivestockForm({
        name: "",
        species: "",
        breed: "",
        birthdate: "",
        weight: "",
        gender: "",
        locationId: "",
        status: "",
        notes: "",
      });

      setShowLivestockModal(false);
      fetchAnalytics(); // Refresh dashboard
    } catch (err) {
      console.error("Failed to add livestock:", err);
    }
  };

  const getKeyByTimeRange = (dateStr, groupBy) => {
    if (!dateStr) return "";

    const parsed = parseISO(dateStr);

    if (groupBy === "month") {
      return format(parsed, "MM-yyyy");
    }

    if (groupBy === "week") {
      const weekNum = getWeek(parsed);
      return `W${String(weekNum).padStart(2, "0")}-${parsed.getFullYear()}`;
    }

    return format(parsed, "MM-dd-yyyy");
  };

  const feedChartData = useMemo(() => {
    const dates = new Set();

    feedExpenses.forEach((exp) => dates.add(getKeyByTimeRange(exp.date, view)));
    eggLogs.forEach((log) => dates.add(getKeyByTimeRange(log.date, view)));

    const sortedDates = Array.from(dates).sort();

    const feedMap = {};
    feedExpenses.forEach((exp) => {
      const key = getKeyByTimeRange(exp.date, view);
      feedMap[key] = (feedMap[key] || 0) + exp.cost;
    });

    const eggMap = {};
    eggLogs.forEach((log) => {
      const key = getKeyByTimeRange(log.date, view);
      eggMap[key] = (eggMap[key] || 0) + log.eggsCollected;
    });

    let cumulativeFeed = 0;
    let cumulativeEggs = 0;

    return sortedDates.map((date) => {
      cumulativeFeed += feedMap[date] || 0;
      cumulativeEggs += eggMap[date] || 0;

      return {
        period: date,
        feedCost: parseFloat(cumulativeFeed.toFixed(2)),
        costPerEgg:
          cumulativeEggs > 0
            ? parseFloat((cumulativeFeed / cumulativeEggs).toFixed(2))
            : 0,
      };
    });
  }, [feedExpenses, eggLogs, view]);

  const aggregateData = (groupBy, expenses = [], incomes = []) => {
    const dataMap = {};

    expenses.forEach((exp) => {
      if (!exp.date) return;
      let key = getKeyByTimeRange(exp.date, groupBy);
      if (!dataMap[key]) dataMap[key] = { expenses: 0, incomes: 0 };
      dataMap[key].expenses += exp.grandTotal || 0;
    });

    incomes.forEach((inc) => {
      if (!inc.date) return;
      let key = getKeyByTimeRange(inc.date, groupBy);
      if (!dataMap[key]) dataMap[key] = { expenses: 0, incomes: 0 };
      dataMap[key].incomes += inc.amount || 0;
    });

    return Object.keys(dataMap)
      .sort()
      .map((key) => ({
        period: key,
        expenses: parseFloat(dataMap[key].expenses.toFixed(2)),
        incomes: parseFloat(dataMap[key].incomes.toFixed(2)),
      }));
  };

  const eggChartData = useMemo(() => {
    const map = {};
    Object.entries(analytics.eggsPerDay).forEach(([dateStr, total]) => {
      const key = getKeyByTimeRange(dateStr, view);
      map[key] = (map[key] || 0) + total;
    });

    return Object.keys(map)
      .sort()
      .map((period) => ({
        period:
          view === "day" && isValid(parseISO(period))
            ? format(parseISO(period), "MM-dd-yyyy")
            : period,
        eggs: map[period],
      }));
  }, [analytics.eggsPerDay, view]);

  const chartData = feedExpenses.map((exp) => ({
    date: new Date(exp.expenseDate).toLocaleDateString(),
    feedCost: exp.lineTotal,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Modern Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faTractor} className="h-8 w-8 text-green-600" />
                Farm Inventory
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage livestock, equipment, supplies, and field operations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
                <FontAwesomeIcon icon={faCow} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: faChartBar },
              { id: 'livestock', label: 'Livestock', icon: faCow },
              { id: 'supplies', label: 'Equipment & Supplies', icon: faTractor },
              { id: 'analytics', label: 'Analytics', icon: faChartLine }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          className="relative group bg-brown-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-brown-400"
          onClick={() => navigate("/dashboard/inventory/livestock")}
        >
          <FontAwesomeIcon
            icon={faCow}
            className="text-brown-600 text-2xl mb-2"
          />
          <p className="font-bold text-lg">{analytics.livestock}</p>
          <p className="text-sm">Livestock</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchLivestockAndFlocks();
              setShowLivestockModal(true);
            }}
            className="mt-2 px-3 py-1 bg-brown-100 text-black text-xs font-semibold rounded 
      w-full sm:w-auto 
      opacity-100 md:opacity-0 md:group-hover:opacity-100 
      transition-opacity duration-300"
          >
            ➕ Add Animal
          </button>
        </div>

        <div
          className="relative group bg-yellow-200 p-4 rounded-lg text-center shadow 
             cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-yellow-400"
        >
          <div
            onClick={() => navigate("/dashboard/inventory/chickens")}
            className="cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faCrow}
              className="text-yellow-600 text-2xl mb-2"
            />
            <p className="font-bold text-lg">{analytics.chickens}</p>
            <p className="text-sm">Chicken Flocks</p>
          </div>

          {/* Log Egg button - doesn’t trigger navigate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchLivestockAndFlocks();
              setShowEggModal(true);
            }}
            className="mt-2 px-3 py-1 bg-yellow-100 text-black text-xs font-semibold rounded 
       w-full sm:w-auto
       opacity-100 md:opacity-0 md:group-hover:opacity-100 
       transition-opacity duration-300"
          >
            🥚 Log Egg
          </button>
        </div>

        <div
          className="bg-green-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-green-400"
          onClick={() => navigate("/dashboard/inventory/fields")}
        >
          <FontAwesomeIcon
            icon={faWheatAwn}
            className="text-green-600 text-2xl mb-2"
          />
          <p className="font-bold text-lg">{analytics.fields}</p>
          <p className="text-sm">Fields</p>
        </div>

        <div className="relative group bg-purple-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-purple-400">
          <div onClick={() => navigate("/dashboard/inventory/inventory-items")}>
            <FontAwesomeIcon
              icon={faTractor}
              className="text-purple-600 text-2xl mb-2"
            />
            <p className="font-bold text-lg">{analytics.items.length}</p>
            <p className="text-sm">Equipment & Supplies</p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSuppliesModal(true);
            }}
            className="mt-2 px-3 py-1 bg-purple-100 text-black text-xs font-semibold rounded 
       w-full sm:w-auto 
       opacity-100 md:opacity-0 md:group-hover:opacity-100 
       transition-opacity duration-300"
          >
            📦 Add Supply
          </button>
        </div>

        <div
          className="col-span-2 md:col-span-4 bg-indigo-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-indigo-400"
          onClick={() => navigate("/dashboard/inventory/fields")}
        >
          <FontAwesomeIcon
            icon={faMap}
            className="text-indigo-600 text-2xl mb-2"
          />
          <p className="font-bold text-xl">
            {analytics.totalAcres.toFixed(1)} acres
          </p>
          <p className="text-sm">Total Acreage</p>
        </div>
          </div>

          {/* Egg Collection Chart - Overview */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Egg Collection Trend</h2>
              <div className="flex gap-2">
                {["day", "week", "month"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setView(option)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ${
                      view === option
                        ? "bg-yellow-500 text-white border-yellow-500 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-50 hover:border-yellow-300"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={eggChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tickCount={6} />
                <Tooltip
                  formatter={(value) => [`${value} eggs`, "Collected"]}
                  labelFormatter={(label) => {
                    if (!label) return "";
                    try {
                      return "Date: " + format(parseISO(label), "MM-dd-yyyy");
                    } catch {
                      return "Date: " + label;
                    }
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="eggs"
                  name="Eggs Collected"
                  stroke="#facc15"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#facc15' }}
                  activeDot={{ r: 6, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Livestock Tab */}
      {activeTab === 'livestock' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Livestock Management</h2>
                <p className="text-gray-600">Track your animals, breeding, and livestock health</p>
              </div>
              <Button
                onClick={() => {
                  fetchLivestockAndFlocks();
                  setShowLivestockModal(true);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                🐄 Add Livestock
              </Button>
            </div>

            {/* Livestock Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-100 p-6 rounded-xl border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Total Animals</h3>
                <p className="text-3xl font-bold text-amber-600">{analytics.livestock}</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-100 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Chicken Flocks</h3>
                <p className="text-3xl font-bold text-yellow-600">{analytics.chickens}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Species Types</h3>
                <p className="text-3xl font-bold text-green-600">{Object.keys(analytics.livestockBySpecies).length}</p>
              </div>
            </div>

            {/* Species Breakdown */}
            {Object.keys(analytics.livestockBySpecies).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Species Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.livestockBySpecies).map(([species, count]) => (
                    <div key={species} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                      <p className="text-sm text-gray-600 capitalize">{species}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Feed Expenses Chart */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Feed Expenses & Cost Per Egg</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name.includes("Cost per Egg")) {
                      return [`$${value.toFixed(2)}`, name];
                    }
                    return [`$${value.toFixed(2)}`, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="feedCost"
                  stroke="#34d399"
                  name="Feed Cost ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="costPerEgg"
                  stroke="#facc15"
                  name="Cost per Egg ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Field Utilization */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Field Utilization</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {analytics.fieldUtilization.map(({ name, acres, livestockCount }) => (
                <div
                  key={name}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    {name}
                  </h3>

                  <div className="flex justify-between items-center text-sm text-gray-700">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium text-green-700">{acres}</span>{" "}
                        acres
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="font-medium text-blue-700">
                          {livestockCount}
                        </span>{" "}
                        livestock
                      </p>
                    </div>

                    <div className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                      Active
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipment & Supplies Tab */}
      {activeTab === 'supplies' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Equipment & Supplies</h2>
                <p className="text-gray-600">Manage your farm equipment, tools, feed, and supplies</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search supplies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {inventoryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                
                <Button
                  onClick={() => setShowSuppliesModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <span>📦</span> Add Supply
                </Button>
              </div>
            </div>

            {/* Enhanced Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl text-center border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faTractor} className="text-white text-lg" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{analytics.items.length}</div>
                <div className="text-sm text-blue-700 font-medium">Total Items</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl text-center border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${analytics.items.reduce((sum, item) => sum + (item.quantity * (item.unitCost || 0)), 0).toFixed(0)}
                </div>
                <div className="text-sm text-green-700 font-medium">Total Value</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl text-center border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⚠️</span>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {analytics.items.filter(item => (item.quantity || 0) <= (item.minStock || 0)).length}
                </div>
                <div className="text-sm text-yellow-700 font-medium">Low Stock</div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl text-center border border-red-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">❌</span>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {analytics.items.filter(item => (item.quantity || 0) === 0).length}
                </div>
                <div className="text-sm text-red-700 font-medium">Out of Stock</div>
              </div>
            </div>

            {/* Inventory Items with improved styling */}
            <div className="space-y-4">
              {inventoryTypes
                .filter((type) => type !== "All")
                .filter((type) => selectedType === "All" || selectedType === type)
                .map((type) => (
                  <InventoryItemGroup
                    key={type}
                    type={type}
                    items={filteredItems.filter((item) => 
                      item.type === type && 
                      (!searchTerm || item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.notes?.toLowerCase().includes(searchTerm.toLowerCase()))
                    )}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-20 text-gray-600">
        <p>
          This feature is in early access, please be patient — we'd love your
          feedback! <FontAwesomeIcon icon={faFaceLaughBeam} />
        </p>
      </div>
      </div>

      {/* Egg Modal */}
      <Modal
        isOpen={showEggModal}
        onClose={() => setShowEggModal(false)}
        title="Log Egg Collection"
      >
        <div className="space-y-4">
          <select
            value={eggForm.flockId}
            onChange={(e) =>
              setEggForm({ ...eggForm, flockId: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="">Select Flock</option>
            {flocks.map((f) => (
              <option key={f.id} value={f.id}>
                {f.breed} ({f.count})
              </option>
            ))}
          </select>
          <input
            type="date"
            value={eggForm.date}
            onChange={(e) => setEggForm({ ...eggForm, date: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Eggs Collected"
            value={eggForm.eggsCollected}
            onChange={(e) =>
              setEggForm({ ...eggForm, eggsCollected: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <Button
            onClick={handleSubmitEggLog}
            className="bg-green-600 text-white w-full"
          >
            Submit
          </Button>
        </div>
      </Modal>

      {/* Livestock Modal */}
      <Modal
        isOpen={showLivestockModal}
        onClose={() => setShowLivestockModal(false)}
        title="Add Livestock"
      >
        <div className="space-y-3">
          <input
            placeholder="Name"
            value={livestockForm.name}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, name: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <select
            value={livestockForm.species}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, species: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="">Select Species</option>
            <option value="Cow">Cow</option>
            <option value="Pig">Pig</option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
          </select>

          <input
            placeholder="Breed"
            value={livestockForm.breed}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, breed: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <input
            type="date"
            value={livestockForm.birthdate}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, birthdate: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Weight (lbs)"
            value={livestockForm.weight}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, weight: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <select
            value={livestockForm.gender}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, gender: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>

          <select
            value={livestockForm.locationId}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, locationId: e.target.value })
            }
            className="border p-2 rounded w-full"
          >
            <option value="">Select Field (Optional)</option>
            {analytics.fieldAcreage.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>

          <div className="flex justify-between gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="Sold"
                checked={livestockForm.status === "Sold"}
                onChange={() =>
                  setLivestockForm({ ...livestockForm, status: "Sold" })
                }
              />
              Sold
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="Butchered"
                checked={livestockForm.status === "Butchered"}
                onChange={() =>
                  setLivestockForm({ ...livestockForm, status: "Butchered" })
                }
              />
              Butchered
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value=""
                checked={!livestockForm.status}
                onChange={() =>
                  setLivestockForm({ ...livestockForm, status: "" })
                }
              />
              Active
            </label>
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={livestockForm.notes}
            onChange={(e) =>
              setLivestockForm({ ...livestockForm, notes: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <div>
            <label className="font-semibold text-sm mb-1 block">
              Select Parent(s)
            </label>
            <select
              multiple
              value={parentIDs}
              onChange={(e) =>
                setParentIDs(
                  [...e.target.selectedOptions].map((opt) => opt.value)
                )
              }
              className="border p-2 rounded w-full"
            >
              {livestock.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} ({animal.species})
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleSubmitLivestock}
            className="bg-green-600 text-white w-full"
          >
            Add Animal
          </Button>
        </div>
      </Modal>

      {/* Supplies Modal */}
      <Modal
        isOpen={showSuppliesModal}
        onClose={() => setShowSuppliesModal(false)}
        title="Add Equipment/Supply Item"
      >
        <div className="space-y-4">
          <input
            placeholder="Item Name"
            value={suppliesForm.name}
            onChange={(e) => setSuppliesForm({ ...suppliesForm, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          
          <textarea
            placeholder="Description (optional)"
            value={suppliesForm.description}
            onChange={(e) => setSuppliesForm({ ...suppliesForm, description: e.target.value })}
            className="border p-2 rounded w-full"
            rows={2}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <select
              value={suppliesForm.category}
              onChange={(e) => setSuppliesForm({ ...suppliesForm, category: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="FEED_NUTRITION">Feed & Nutrition</option>
              <option value="TOOLS_EQUIPMENT">Tools & Equipment</option>
              <option value="FERTILIZERS">Fertilizers</option>
              <option value="SEEDS_PLANTS">Seeds & Plants</option>
              <option value="PESTICIDES">Pesticides</option>
              <option value="SUPPLIES">General Supplies</option>
            </select>
            
            <select
              value={suppliesForm.location}
              onChange={(e) => setSuppliesForm({ ...suppliesForm, location: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="MAIN_STORAGE">Main Storage</option>
              <option value="BARN">Barn</option>
              <option value="GREENHOUSE">Greenhouse</option>
              <option value="FIELD_SHED">Field Shed</option>
              <option value="OUTDOOR">Outdoor Storage</option>
            </select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Current Stock"
              value={suppliesForm.currentStock}
              onChange={(e) => setSuppliesForm({ ...suppliesForm, currentStock: parseInt(e.target.value) || 0 })}
              className="border p-2 rounded"
            />
            
            <input
              type="number"
              placeholder="Min Stock"
              value={suppliesForm.minimumStock}
              onChange={(e) => setSuppliesForm({ ...suppliesForm, minimumStock: parseInt(e.target.value) || 0 })}
              className="border p-2 rounded"
            />
            
            <select
              value={suppliesForm.unit}
              onChange={(e) => setSuppliesForm({ ...suppliesForm, unit: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="PIECES">Pieces</option>
              <option value="BAGS">Bags</option>
              <option value="GALLONS">Gallons</option>
              <option value="POUNDS">Pounds</option>
              <option value="BOTTLES">Bottles</option>
            </select>
          </div>
          
          <input
            type="number"
            step="0.01"
            placeholder="Unit Cost ($)"
            value={suppliesForm.unitCost}
            onChange={(e) => setSuppliesForm({ ...suppliesForm, unitCost: parseFloat(e.target.value) || 0 })}
            className="border p-2 rounded w-full"
          />
          
          <Button
            onClick={() => {
              // TODO: Implement add supply functionality
              console.log('Add supply:', suppliesForm);
              setShowSuppliesModal(false);
              // Reset form
              setSuppliesForm({
                name: "",
                description: "",
                category: "FEED_NUTRITION",
                location: "MAIN_STORAGE",
                currentStock: 0,
                minimumStock: 0,
                unit: "PIECES",
                unitCost: 0,
              });
            }}
            className="bg-purple-600 text-white w-full"
          >
            Add Supply Item
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const InventoryItemGroup = ({ type, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const totalValue = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0),
    0
  );

  const isLowStock = () => {
    if (type === "Feed" && totalQuantity < 50) return true;
    if (type === "Hay" && totalQuantity < 5) return true;
    return items.some(item => (item.quantity || 0) <= (item.minStock || 0));
  };

  const getCategoryIcon = (type) => {
    const icons = {
      'Feed': '🌾',
      'Tools': '🔧',
      'Seeds': '🌱',
      'Equipment': '🚜',
      'Supplies': '📦',
      'Hay': '🌿',
      'Fertilizer': '🧪',
      'Pesticides': '🦟',
    };
    return icons[type] || '📦';
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-6 border rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 cursor-pointer transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="text-2xl">{getCategoryIcon(type)}</div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{type}</h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-600">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Total: ${totalValue.toFixed(2)}
              </span>
            </div>
          </div>
          {isLowStock() && (
            <span className="text-red-600 text-xs bg-red-100 px-3 py-1 rounded-full font-medium border border-red-200 animate-pulse">
              ⚠️ Low Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">Qty: {totalQuantity}</p>
            <p className="text-xs text-gray-500">Total Quantity</p>
          </div>
          <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-100' : 'bg-gray-100'}`}>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-4 h-4 ${isExpanded ? 'text-blue-600' : 'text-gray-500'}`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            {items.map(({ id, name, quantity, notes, unitCost, minStock }) => {
              const isItemLowStock = (quantity || 0) <= (minStock || 0);
              const itemValue = (quantity || 0) * (unitCost || 0);
              
              return (
                <div 
                  key={id} 
                  className={`bg-white p-4 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                    isItemLowStock ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">{name}</p>
                        {isItemLowStock && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            Low Stock
                          </span>
                        )}
                      </div>
                      {notes && (
                        <p className="text-gray-600 text-sm mb-2 italic">{notes}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {unitCost && <span>Unit Cost: ${unitCost.toFixed(2)}</span>}
                        {minStock && <span>Min Stock: {minStock}</span>}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className={`text-lg font-bold ${isItemLowStock ? 'text-red-600' : 'text-gray-800'}`}>
                        {quantity || 0}
                      </p>
                      <p className="text-xs text-gray-500">in stock</p>
                      {itemValue > 0 && (
                        <p className="text-sm font-medium text-green-600 mt-1">
                          ${itemValue.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
