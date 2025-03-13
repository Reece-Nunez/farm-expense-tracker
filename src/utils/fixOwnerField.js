import { DataStore } from "@aws-amplify/datastore";
import { Expense } from "../models";

export async function fixOwnerField() {
  try {
    // Get ALL expenses from DataStore (or filter by your userId if you prefer)
    const allExpenses = await DataStore.query(Expense);

    console.log(`✅ Found ${allExpenses.length} expenses to check.`);

    for (const exp of allExpenses) {
      // Check if the owner field has the "::" issue
      if (exp.owner && exp.owner.includes("::")) {
        const fixedOwner = exp.owner.split("::")[1]; // Gets just "nunezfam"

        console.log(`🔧 Fixing Expense ID: ${exp.id} | Owner: ${exp.owner} → ${fixedOwner}`);

        // Save the updated record
        await DataStore.save(
          Expense.copyOf(exp, updated => {
            updated.owner = fixedOwner;
          })
        );
      }
    }

    console.log("✅ All owner fields fixed!");
  } catch (error) {
    console.error("❌ Error fixing owner fields:", error);
  }
}
