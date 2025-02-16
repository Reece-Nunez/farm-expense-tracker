// **Amplify DataStore CRUD operations utility file: expenseService.js**

import { DataStore } from 'aws-amplify';
import { Expense } from '../models';
import { toast } from 'react-hot-toast';

// Create Expense
export async function createExpense(data) {
  try {
    await DataStore.save(new Expense(data));
    toast.success('Expense saved successfully!');
  } catch (error) {
    toast.error('Failed to save expense: ' + error.message);
  }
}

// Read Expenses
export async function fetchExpenses(setExpenses) {
  try {
    const expenses = await DataStore.query(Expense);
    setExpenses(expenses);
  } catch (error) {
    toast.error('Failed to fetch expenses: ' + error.message);
  }
}

// Update Expense
export async function updateExpense(expense, newData) {
  try {
    await DataStore.save(
      Expense.copyOf(expense, updated => {
        Object.assign(updated, newData);
      })
    );
    toast.success('Expense updated successfully!');
  } catch (error) {
    toast.error('Failed to update expense: ' + error.message);
  }
}

// Delete Expense
export async function deleteExpense(expense) {
  try {
    await DataStore.delete(expense);
    toast.success('Expense deleted successfully!');
  } catch (error) {
    toast.error('Failed to delete expense: ' + error.message);
  }
}
