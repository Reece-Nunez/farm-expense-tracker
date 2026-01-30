"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  parseExpenseRow,
  parseIncomeRow,
  groupExpensesByVendorDate,
} from "@/lib/csv-service";
import type { PaymentMethod } from "@/types/database";

// Result type for actions
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Import expenses from transformed CSV data
 */
export async function importExpenses(
  farmId: string,
  data: Record<string, unknown>[]
): Promise<ActionResult<{ imported: number }>> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Parse and group expense data
    const parsedRows = data.map((row) => parseExpenseRow(row));
    const grouped = groupExpensesByVendorDate(parsedRows);

    let importedCount = 0;

    // Create expenses with line items
    for (const [, lineItems] of grouped) {
      if (lineItems.length === 0) continue;

      const firstItem = lineItems[0];
      const grandTotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

      // Create expense
      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .insert({
          farm_id: farmId,
          user_id: user.id,
          date: firstItem.date,
          vendor: firstItem.vendor,
          notes: firstItem.notes || null,
          grand_total: grandTotal,
        })
        .select("id")
        .single();

      if (expenseError) {
        console.error("Error creating expense:", expenseError);
        continue;
      }

      // Create line items
      const lineItemsToInsert = lineItems.map((item) => ({
        expense_id: expense.id,
        item: item.item,
        category: item.category,
        quantity: item.quantity,
        unit_cost: item.unitCost,
        line_total: item.lineTotal,
      }));

      const { error: lineItemsError } = await supabase
        .from("line_items")
        .insert(lineItemsToInsert);

      if (lineItemsError) {
        console.error("Error creating line items:", lineItemsError);
        // Clean up the expense if line items failed
        await supabase.from("expenses").delete().eq("id", expense.id);
        continue;
      }

      importedCount++;
    }

    revalidatePath("/expenses");
    revalidatePath("/import");

    return { success: true, data: { imported: importedCount } };
  } catch (error) {
    console.error("Error in importExpenses:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Map string payment method to PaymentMethod enum
function mapPaymentMethod(method: string): PaymentMethod | null {
  const methodMap: Record<string, PaymentMethod> = {
    cash: "CASH",
    check: "CHECK",
    credit_card: "CREDIT_CARD",
    "credit card": "CREDIT_CARD",
    creditcard: "CREDIT_CARD",
    debit_card: "DEBIT_CARD",
    "debit card": "DEBIT_CARD",
    debitcard: "DEBIT_CARD",
    bank_transfer: "BANK_TRANSFER",
    "bank transfer": "BANK_TRANSFER",
    banktransfer: "BANK_TRANSFER",
    wire: "BANK_TRANSFER",
    online: "ONLINE",
    paypal: "ONLINE",
    venmo: "ONLINE",
    other: "OTHER",
  };

  const normalized = method.toLowerCase().trim();
  return methodMap[normalized] || null;
}

/**
 * Import income from transformed CSV data
 */
export async function importIncome(
  farmId: string,
  data: Record<string, unknown>[]
): Promise<ActionResult<{ imported: number }>> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    let importedCount = 0;

    // Create income records
    for (const row of data) {
      const parsed = parseIncomeRow(row);
      const paymentMethod = parsed.paymentMethod
        ? mapPaymentMethod(parsed.paymentMethod)
        : null;

      const { error: incomeError } = await supabase.from("income").insert({
        farm_id: farmId,
        user_id: user.id,
        date: parsed.date,
        item: parsed.item,
        quantity: parsed.quantity,
        price: parsed.price,
        amount: parsed.amount,
        payment_method: paymentMethod,
        notes: parsed.notes || null,
      });

      if (incomeError) {
        console.error("Error creating income:", incomeError);
        continue;
      }

      importedCount++;
    }

    revalidatePath("/income");
    revalidatePath("/import");

    return { success: true, data: { imported: importedCount } };
  } catch (error) {
    console.error("Error in importIncome:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Note: Import history is tracked in application memory for now
// To persist import history, create an import_history table in your Supabase schema

/**
 * Log an import to the import history (placeholder - requires import_history table)
 */
export async function logImport(
  farmId: string,
  type: "expenses" | "income",
  filename: string,
  totalRows: number,
  successfulRows: number,
  failedRows: number
): Promise<ActionResult<{ id: string }>> {
  // This is a placeholder. To persist import history,
  // create an import_history table in your Supabase database:
  //
  // CREATE TABLE import_history (
  //   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  //   farm_id UUID NOT NULL REFERENCES farms(id),
  //   user_id UUID NOT NULL REFERENCES auth.users(id),
  //   import_type TEXT NOT NULL,
  //   filename TEXT NOT NULL,
  //   total_rows INTEGER NOT NULL,
  //   successful_rows INTEGER NOT NULL,
  //   failed_rows INTEGER NOT NULL,
  //   status TEXT NOT NULL,
  //   created_at TIMESTAMPTZ DEFAULT NOW()
  // );

  console.log("Import logged:", {
    farmId,
    type,
    filename,
    totalRows,
    successfulRows,
    failedRows,
  });

  return { success: true, data: { id: crypto.randomUUID() } };
}

/**
 * Get import history for a farm (placeholder - requires import_history table)
 */
export async function getImportHistory(
  farmId: string,
  options: {
    page?: number;
    pageSize?: number;
    type?: "expenses" | "income";
  } = {}
) {
  // This is a placeholder. Implement after creating import_history table.
  return {
    imports: [],
    total: 0,
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    totalPages: 0,
  };
}
