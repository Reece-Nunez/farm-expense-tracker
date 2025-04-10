import { generateClient } from 'aws-amplify/api';
import { listExpenses } from '../graphql/queries.js';
import { updateExpense } from '../graphql/mutations.js';
import { getCurrentUser } from './getCurrentUser.js';

const client = generateClient();

async function addSubToMissingExpenses() {
  const user = await getCurrentUser();
  const { data } = await client.graphql({
    query: listExpenses,
    variables: { limit: 1000 },
  });

  const expenses = data.listExpenses.items;

  const missingSub = expenses.filter((e) => !e.sub);
  console.log(`Found ${missingSub.length} expenses missing sub.`);

  for (const exp of missingSub) {
    const input = {
      id: exp.id,
      sub: user.sub,
      userId: exp.userId, // Make sure it's retained
      // include any other required fields here if necessary
    };

    await client.graphql({
      query: updateExpense,
      variables: { input },
    });

    console.log(`Updated expense ${exp.id} with sub: ${user.sub}`);
  }

  console.log("Done updating missing subs.");
}

addSubToMissingExpenses();
