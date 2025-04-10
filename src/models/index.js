// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Expense, LineItem, Income, Field, Livestock, LivestockFamily, MedicalRecord, ChickenFlock, EggLog, InventoryItem } = initSchema(schema);

export {
  User,
  Expense,
  LineItem,
  Income,
  Field,
  Livestock,
  LivestockFamily,
  MedicalRecord,
  ChickenFlock,
  EggLog,
  InventoryItem
};