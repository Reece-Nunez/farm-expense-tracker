import { generateClient } from "aws-amplify/api";
import { createLineItem } from "../../graphql/mutations";

const lineItemsToCreate = [
  [
    {

      expenseID: "f27614e9-cf08-4d3f-9bf1-4e6abb297596",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "tax",
      category: "Taxes",
      quantity: 1,
      unitCost: 3.5,
      lineTotal: 3.5
    },
    {

      expenseID: "c2b4a700-0476-4d20-a852-4d193b4eb8b2",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Duralast Booster Cables",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 54.99,
      lineTotal: 54.99
    },



    {

      expenseID: "a04f3036-32b9-49c2-b4f1-65f47c43c9ef",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Septic deposit",
      category: "Utilities",
      quantity: 1,
      unitCost: 500.0,
      lineTotal: 500.0
    },



    {

      expenseID: "4e44aa5d-9568-4b36-9665-a5e481285976",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "20oz single",
      category: "Medicine",
      quantity: 1,
      unitCost: 1.99,
      lineTotal: 1.99
    },



    {

      expenseID: "4e44aa5d-9568-4b36-9665-a5e481285976",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Ultra start mult colostrum supplement",
      category: "Medicine",
      quantity: 1,
      unitCost: 12.99,
      lineTotal: 12.99
    },



    {

      expenseID: "4e44aa5d-9568-4b36-9665-a5e481285976",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Iodine gentle",
      category: "Medicine",
      quantity: 1,
      unitCost: 9.99,
      lineTotal: 9.99
    },



    {

      expenseID: "4e44aa5d-9568-4b36-9665-a5e481285976",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "tax",
      category: "Taxes",
      quantity: 1,
      unitCost: 0.18,
      lineTotal: 0.18
    },



    {

      expenseID: "07c30e16-86e8-4f0f-9df8-79ef29802968",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Storage Units",
      category: "Storage and Warehousing",
      quantity: 1,
      unitCost: 175.0,
      lineTotal: 175.0
    },



    {

      expenseID: "86f2ce95-abaa-452e-bede-6ade16ceeb50",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Pig Food Buckets",
      category: "Supplies Purchased",
      quantity: 3,
      unitCost: 11.99,
      lineTotal: 35.97
    },



    {

      expenseID: "a16bb2e9-3b58-49df-8be4-f59c0e813f82",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Valve stem",
      category: "Farm Equipment",
      quantity: 1,
      unitCost: 3.0,
      lineTotal: 3.0
    },

    {

      expenseID: "a16bb2e9-3b58-49df-8be4-f59c0e813f82",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "rotate balance life tire",
      category: "Farm Equipment",
      quantity: 1,
      unitCost: 15.0,
      lineTotal: 15.0
    },


    {

      expenseID: "a16bb2e9-3b58-49df-8be4-f59c0e813f82",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "stock trailer tire + tire fee",
      category: "Farm Equipment",
      quantity: 4,
      unitCost: 104.9,
      lineTotal: 419.6
    },



    {

      expenseID: "a16bb2e9-3b58-49df-8be4-f59c0e813f82",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Tax",
      category: "Taxes",
      quantity: 1,
      unitCost: 39.39,
      lineTotal: 39.39
    },



    {

      expenseID: "b842eb4b-f4bd-4a76-8080-49fd6feb86bb",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "3x5 window",
      category: "Supplies Purchased",
      quantity: 2,
      unitCost: 227.05,
      lineTotal: 454.1
    },


    {

      expenseID: "d034cb59-c4e1-417c-927b-5b3473abb11f",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Ins for barn",
      category: "Insurance (Not Health)",
      quantity: 1,
      unitCost: 689.0,
      lineTotal: 689.0
    },



    {

      expenseID: "255bd796-562b-41c3-bc75-d9aa596793f2",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Fuel/Travel",
      category: "Custom Hire",
      quantity: 1,
      unitCost: 1500.0,
      lineTotal: 1500.0
    },



    {

      expenseID: "255bd796-562b-41c3-bc75-d9aa596793f2",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Contractor",
      category: "Custom Hire",
      quantity: 12,
      unitCost: 150.0,
      lineTotal: 1800.0
    },



    {

      expenseID: "255bd796-562b-41c3-bc75-d9aa596793f2",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Profit and permitting",
      category: "Custom Hire",
      quantity: 1,
      unitCost: 1200.0,
      lineTotal: 1200.0
    },


    {

      expenseID: "2f2d485c-bb97-40ae-898c-bab6b4bf51b9",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Window for shop",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 227.05,
      lineTotal: 227.05
    },
    {

      expenseID: "f0a02f91-5d30-4f82-96eb-cd31e39dcd02",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "20G x 1 alum hub disp",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 3.99,
      lineTotal: 3.99
    },

    {

      expenseID: "f0a02f91-5d30-4f82-96eb-cd31e39dcd02",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Vit B Complex Oral Gel 30ml",
      category: "Medicine",
      quantity: 1,
      unitCost: 18.99,
      lineTotal: 18.99
    },


    {

      expenseID: "f0a02f91-5d30-4f82-96eb-cd31e39dcd02",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Syringe 12 ML 4pk",
      category: "Medicine",
      quantity: 1,
      unitCost: 3.99,
      lineTotal: 3.99
    },



    {

      expenseID: "f0a02f91-5d30-4f82-96eb-cd31e39dcd02",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Colostrum pack",
      category: "Medicine",
      quantity: 1,
      unitCost: 16.99,
      lineTotal: 16.99
    },


    {

      expenseID: "f0a02f91-5d30-4f82-96eb-cd31e39dcd02",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "fluid feeder",
      category: "Medicine",
      quantity: 1,
      unitCost: 19.99,
      lineTotal: 19.99
    },



    {

      expenseID: "bf2ec0ca-fcae-4bb2-88c7-5a86b121b2f7",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Food for Travel",
      category: "Feed Purchased",
      quantity: 1,
      unitCost: 49.15,
      lineTotal: 49.15
    },



    {

      expenseID: "7b0ff769-5f88-41b4-9a80-d5588966b6c5",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Hose",
      category: "Supplies Purchased",
      quantity: 2,
      unitCost: 76.69,
      lineTotal: 153.38
    },


    {

      expenseID: "efa1ed34-876a-43f7-81fc-ce970fc8f2bf",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Chicken Feeder",
      category: "Feed Purchased",
      quantity: 1,
      unitCost: 44.94,
      lineTotal: 44.94
    },


    {

      expenseID: "4959fc61-8c48-45ae-baff-96c434755e46",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Dura fork",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 14.94,
      lineTotal: 14.94
    },


    {

      expenseID: "4959fc61-8c48-45ae-baff-96c434755e46",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Plant flat 11 x 22",
      category: "Supplies Purchased",
      quantity: 10,
      unitCost: 1.59,
      lineTotal: 15.9
    },



    {

      expenseID: "4959fc61-8c48-45ae-baff-96c434755e46",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Soft touch round curry",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 9.99,
      lineTotal: 9.99
    },



    {

      expenseID: "4959fc61-8c48-45ae-baff-96c434755e46",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Work horse stiff synth",
      category: "Medicine",
      quantity: 1,
      unitCost: 4.94,
      lineTotal: 4.94
    },



    {

      expenseID: "4959fc61-8c48-45ae-baff-96c434755e46",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Safeguard wormer pellets",
      category: "Medicine",
      quantity: 3,
      unitCost: 9.99,
      lineTotal: 29.97
    },


    {

      expenseID: "4959fc61-8c48-45ae-baff-96c434755e46",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "tax",
      category: "Taxes",
      quantity: 1,
      unitCost: 1.47,
      lineTotal: 1.47
    },

    {

      expenseID: "865ecea7-c532-40e8-bdc0-9f9ecf15c504",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Side by Side",
      category: "Farm Equipment",
      quantity: 1,
      unitCost: 5000.0,
      lineTotal: 5000.0
    },



    {

      expenseID: "97f02b01-a872-4682-8fa3-a9655f12f746",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Propane Exchange",
      category: "Gasoline, Fuel, and Oil",
      quantity: 4,
      unitCost: 18.98,
      lineTotal: 75.92
    },



    {

      expenseID: "97f02b01-a872-4682-8fa3-a9655f12f746",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "tax",
      category: "Taxes",
      quantity: 1,
      unitCost: 7.28,
      lineTotal: 7.28
    },



    {

      expenseID: "97f02b01-a872-4682-8fa3-a9655f12f746",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Donation",
      category: "Taxes",
      quantity: 1,
      unitCost: 0.8,
      lineTotal: 0.8
    },


    {

      expenseID: "290fcd10-08f3-4d1b-af77-1d1bed2dd8ba",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Stretch wrap",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 29.99,
      lineTotal: 29.99
    },



    {

      expenseID: "562f61f1-a67f-49e8-8f02-21c5185bb629",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Chicken Food",
      category: "Repairs and Mainte74c88408-2041-70a6-c023-9dfcbd1495a6ce",
      quantity: 6,
      unitCost: 13.19,
      lineTotal: 79.14
    },



    {

      expenseID: "17d71199-7db8-43fb-9fce-da2be69c9312",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Work gloves",
      category: "Supplies Purchased",
      quantity: 2,
      unitCost: 9.99,
      lineTotal: 19.98
    },

    {

      expenseID: "a2ca7e00-f193-47a1-b075-f9b0492cf7e0",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "laying boxes",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 43.5,
      lineTotal: 43.5
    },



    {

      expenseID: "5d99d017-02ed-483c-8c7e-f70016af8fee",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Plumping parts",
      category: "Repairs and Mainte74c88408-2041-70a6-c023-9dfcbd1495a6ce",
      quantity: 1,
      unitCost: 36.38,
      lineTotal: 36.38
    },


    {

      expenseID: "368f80bf-476c-4993-888d-0d83760b2676",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Trailer rental for equipment",
      category: "Equipment Rental",
      quantity: 1,
      unitCost: 100.0,
      lineTotal: 100.0
    },


    {

      expenseID: "e64b5fc6-8378-437f-93cf-5d2c742557c1",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Layer pellet 50lbs",
      category: "Feed Purchased",
      quantity: 3,
      unitCost: 13.19,
      lineTotal: 39.57
    },


    {

      expenseID: "1f9fda9c-411f-4560-8f35-a900ee414ac5",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Goat Skin Gloves",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 9.99,
      lineTotal: 9.99
    },


    {

      expenseID: "1f9fda9c-411f-4560-8f35-a900ee414ac5",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Pro mechanics gloves",
      category: "Supplies Purchased",
      quantity: 1,
      unitCost: 9.99,
      lineTotal: 9.99
    },


    {

      expenseID: "8840d1d2-03f4-494e-9674-0ec858f3a668",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Gas For Side by Side",
      category: "Gasoline, Fuel, and Oil",
      quantity: 1,
      unitCost: 12.82,
      lineTotal: 12.82
    },



    {

      expenseID: "8840d1d2-03f4-494e-9674-0ec858f3a668",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Gas for Picking Up Side by Side",
      category: "Gasoline, Fuel, and Oil",
      quantity: 1,
      unitCost: 78.86,
      lineTotal: 78.86
    },



    {

      expenseID: "93270391-1789-4af1-9b26-f4c30b20539f",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Electricity feb-mar",
      category: "Utilities",
      quantity: 1,
      unitCost: 21.46,
      lineTotal: 21.46
    },



    {

      expenseID: "02194db1-4f99-4fbe-b431-5c17598bdbf9",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Plumping parts",
      category: "Repairs and Mainte74c88408-2041-70a6-c023-9dfcbd1495a6ce",
      quantity: 1,
      unitCost: 61.21,
      lineTotal: 61.21
    },



    {

      expenseID: "1d466825-592c-413b-9274-01b5dd3941f6",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Examination",
      category: "Vet",
      quantity: 1,
      unitCost: 30.0,
      lineTotal: 30.0
    },


    {

      expenseID: "1d466825-592c-413b-9274-01b5dd3941f6",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Excede - cc",
      category: "Medicine",
      quantity: 1,
      unitCost: 60.0,
      lineTotal: 60.0
    },


    {

      expenseID: "1d466825-592c-413b-9274-01b5dd3941f6",
      sub: "74c88408-2041-70a6-c023-9dfcbd1495a6",
      item: "Excede CC",
      category: "Medicine",
      quantity: 1,
      unitCost: 55.25,
      lineTotal: 55.25
    }


  ]
];

// Client will be created when needed to avoid Amplify configuration race condition

export const runLineItemMutations = async ({ log = console.log } = {}) => {
  log("Running batch createLineItem mutations...");

  // Create client at runtime when Amplify is configured
  const client = generateClient();

  // Flatten the nested array
  const flatItems = lineItemsToCreate.flat();

  for (const item of flatItems) {
    try {
      const res = await client.graphql({
        query: createLineItem,
        variables: {
          input: item
        },
      });
      log(`Created LineItem with ID: ${res.data.createLineItem.id} for expense: ${item.expenseID}`);
    } catch (err) {
      log("Failed to create LineItem:");
      log(`   ExpenseID: ${item.expenseID}`);
      log(`   Item: ${item.item}`);
      log(`   Category: ${item.category}`);
      log(`   Quantity: ${item.quantity}`);
      log(`   unitCost: ${item.unitCost}`);
      log(`   lineTotal: ${item.lineTotal}`);
      log(`   Error: ${JSON.stringify(err, null, 2)}`);
    }
  }

  log("Done!");
  log("All mutations complete!");
};



export default runLineItemMutations;
