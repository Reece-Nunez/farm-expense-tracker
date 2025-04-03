// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Expense, Income, Field, Livestock, LivestockFamily, MedicalRecord, ChickenFlock, EggLog, InventoryItem, LineItem } = initSchema(schema);

export {
  User,
  Expense,
  Income,
  Field,
  Livestock,
  LivestockFamily,
  MedicalRecord,
  ChickenFlock,
  EggLog,
  InventoryItem,
  LineItem
};