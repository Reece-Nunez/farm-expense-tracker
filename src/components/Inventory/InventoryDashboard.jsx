import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { generateClient } from "aws-amplify/api";
import {
  listLivestocks,
  listChickenFlocks,
  listFields,
  listInventoryItems,
  listEggLogs
} from "../../graphql/queries";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCow,
  faEgg,
  faTractor,
  faWarehouse,
  faFaceLaughBeam,
  faMap,
  faWheatAwn
} from "@fortawesome/free-solid-svg-icons";

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
    items: 0
  });


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const user = await getCurrentUser();
        const sub = user?.attributes?.sub || user?.sub;

        if (!sub) {
          console.warn("No user sub found – skipping analytics fetch.");
          return;
        }

        const client = generateClient();

        const [livestockData, chickensData, fieldsData, itemsData, eggLogsData] = await Promise.all([
          client.graphql({
            query: listLivestocks,
            variables: { filter: { sub: { eq: sub } }, limit: 1000 }
          }),
          client.graphql({
            query: listChickenFlocks,
            variables: { filter: { sub: { eq: sub } }, limit: 1000 }
          }),
          client.graphql({
            query: listFields,
            variables: { filter: { sub: { eq: sub } }, limit: 1000 }
          }),
          client.graphql({
            query: listInventoryItems,
            variables: { filter: { sub: { eq: sub } }, limit: 1000 }
          }),
          client.graphql({
            query: listEggLogs,
            variables: { filter: { sub: { eq: sub } }, limit: 1000 }
          }),
        ]);

        const livestock = livestockData?.data?.listLivestocks?.items || [];
        const chickens = chickensData?.data?.listChickenFlocks?.items || [];
        const fields = fieldsData?.data?.listFields?.items || [];
        const items = itemsData?.data?.listInventoryItems?.items || [];
        const eggLogs = eggLogsData?.data?.listEggLogs?.items || [];

        const livestockBySpecies = livestock.reduce((acc, l) => {
          acc[l.species] = (acc[l.species] || 0) + 1;
          return acc;
        }, {});

        const totalAcres = fields.reduce((sum, field) => sum + (field.acres || 0), 0);
        const fieldAcreage = fields.map(f => ({ name: f.name, acres: f.acres || 0 }));
        const fieldUtilization = fields.map(f => {
          const count = livestock.filter(l => l.fieldID === f.id).length;
          return { name: f.name, acres: f.acres || 0, livestockCount: count };
        });

        const eggsPerDay = eggLogs.reduce((acc, log) => {
          acc[log.date] = (acc[log.date] || 0) + (log.eggsCollected || 0);
          return acc;
        }, {});

        setAnalytics({
          livestock: livestock.length,
          livestockBySpecies,
          chickens: chickens.length,
          fields: fields.length,
          totalAcres,
          fieldAcreage,
          fieldUtilization,
          eggsPerDay,
          items: items.length
        });

      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Farm Inventory Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-brown-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-brown-400" onClick={() => navigate("/dashboard/inventory/livestock")}>
          <FontAwesomeIcon icon={faCow} className="text-brown-600 text-2xl mb-2" />
          <p className="font-bold text-lg">{analytics.livestock}</p>
          <p className="text-sm">Livestock</p>
        </div>

        <div className="bg-yellow-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-yellow-400" onClick={() => navigate("/dashboard/inventory/chickens")}>
          <FontAwesomeIcon icon={faEgg} className="text-yellow-600 text-2xl mb-2" />
          <p className="font-bold text-lg">{analytics.chickens}</p>
          <p className="text-sm">Chicken Flocks</p>
        </div>

        <div className="bg-green-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-green-400" onClick={() => navigate("/dashboard/inventory/fields")}>
          <FontAwesomeIcon icon={faWheatAwn} className="text-green-600 text-2xl mb-2" />
          <p className="font-bold text-lg">{analytics.fields}</p>
          <p className="text-sm">Fields</p>
        </div>

        <div className="bg-gray-300 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-gray-400" onClick={() => navigate("/dashboard/inventory/inventory-items")}>
          <FontAwesomeIcon icon={faTractor} className="text-gray-600 text-2xl mb-2" />
          <p className="font-bold text-lg">{analytics.items}</p>
          <p className="text-sm">Equipment</p>
        </div>

        <div className="col-span-2 md:col-span-4 bg-indigo-200 p-4 rounded-lg text-center shadow cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:bg-indigo-400" onClick={() => navigate("/dashboard/inventory/fields")}>
          <FontAwesomeIcon icon={faMap} className="text-indigo-600 text-2xl mb-2" />
          <p className="font-bold text-xl">{analytics.totalAcres.toFixed(1)} acres</p>
          <p className="text-sm">Total Acreage</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Livestock by Species</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.livestockBySpecies).map(([species, count]) => (
            <li key={species} className="bg-gray-50 p-3 rounded border shadow-sm">
              <span className="font-semibold">{species}</span>: {count}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Egg Collection Summary</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.eggsPerDay).map(([date, total]) => (
            <li key={date} className="bg-yellow-50 p-3 rounded border shadow-sm">
              <span className="font-semibold">{date}</span>: {total} eggs
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg p-6 shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Field Utilization</h2>
        <ul className="space-y-2">
          {analytics.fieldUtilization.map(({ name, acres, livestockCount }) => (
            <li key={name} className="bg-green-50 p-3 rounded border shadow-sm">
              <strong>{name}</strong>: {acres} acres — {livestockCount} livestock
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-20 text-gray-600">
        <p>
          This feature is in early access, please be patient — we’d love your feedback! <FontAwesomeIcon icon={faFaceLaughBeam} />
        </p>
      </div>
    </div>
  );
};

export default InventoryDashboard;
