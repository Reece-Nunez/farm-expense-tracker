// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Expense, Income } = initSchema(schema);

export {
  User,
  Expense,
  Income
};