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
  const [feedExpenses, setFeedExpenses] = useState([]);
  const [eggLogs, setEggLogs] = useState([]);
  const [showEggModal, setShowEggModal] = useState(false);
  const [eggForm, setEggForm] = useState({
    flockId: "",
    date: "",
    eggsCollected: "",
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Farm Inventory Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        <div
          className="bg-gray-300 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-gray-400"
          onClick={() => navigate("/dashboard/inventory/inventory-items")}
        >
          <FontAwesomeIcon
            icon={faTractor}
            className="text-gray-600 text-2xl mb-2"
          />
          <p className="font-bold text-lg">{analytics.items.length}</p>
          <p className="text-sm">Items</p>
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
      {/* Egg Chart View Toggle + Chart */}
      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Egg Collection Trend</h2>
          <div className="space-x-2">
            {["day", "week", "month"].map((option) => (
              <button
                key={option}
                onClick={() => setView(option)}
                className={`px-3 py-1 rounded-full border text-sm font-medium ${
                  view === option
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={eggChartData}>
            <CartesianGrid strokeDasharray="3 3" />
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
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="eggs"
              name="Eggs Collected"
              stroke="#facc15"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-50 p-4 rounded border shadow mb-10">
        <h3 className="text-lg font-bold mb-4">Feed Expenses & Cost Per Egg</h3>
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
      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <h2 className="text-xl font-bold mb-6">Field Utilization</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {analytics.fieldUtilization.map(({ name, acres, livestockCount }) => (
            <div
              key={name}
              className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-md font-semibold text-green-800 mb-1">
                {name}
              </h3>

              <div className="flex justify-between items-center text-sm text-gray-700">
                <div>
                  <p>
                    <span className="font-medium text-green-700">{acres}</span>{" "}
                    acres
                  </p>
                  <p>
                    <span className="font-medium text-green-700">
                      {livestockCount}
                    </span>{" "}
                    livestock
                  </p>
                </div>

                {/* Optional icon or label */}
                <div className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  Utilized
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inventory Items</h2>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            {inventoryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {inventoryTypes
          .filter((type) => type !== "All")
          .filter((type) => selectedType === "All" || selectedType === type)
          .map((type) => (
            <InventoryItemGroup
              key={type}
              type={type}
              items={filteredItems.filter((item) => item.type === type)}
            />
          ))}
      </div>
      <div className="text-center mt-20 text-gray-600">
        <p>
          This feature is in early access, please be patient — we’d love your
          feedback! <FontAwesomeIcon icon={faFaceLaughBeam} />
        </p>
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
    </div>
  );
};

const InventoryItemGroup = ({ type, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const isLowStock = () => {
    if (type === "Feed" && totalQuantity < 50) return true;
    if (type === "Hay" && totalQuantity < 5) return true;
    return false;
  };

  return (
    <div className="mb-4 border rounded-lg bg-white shadow-sm">
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-t-lg transition"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">{type}</h3>
          {isLowStock() && (
            <span className="text-red-600 text-xs bg-red-100 px-2 py-0.5 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Qty: {totalQuantity}</span>
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="text-gray-500"
          />
        </div>
      </div>

      {isExpanded && (
        <ul className="px-4 py-2 space-y-2 border-t transition-all">
          {items.map(({ id, name, quantity, notes }) => (
            <li key={id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{name}</p>
                {notes && (
                  <p className="text-gray-500 italic text-xs">{notes}</p>
                )}
              </div>
              <span className="text-gray-500">Qty: {quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InventoryDashboard;
