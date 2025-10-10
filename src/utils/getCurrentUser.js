import { fetchAuthSession } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { getUser } from "../graphql/queries.js";
import { createUser } from "../graphql/mutations.js";
import { toast } from "react-hot-toast";

export const getCurrentUser = async () => {
  const client = generateClient();

  try {
    const session = await fetchAuthSession();

    const sub = session.tokens?.idToken?.payload?.sub;
    const username = session.tokens?.idToken?.payload?.["cognito:username"];
    const email = session.tokens?.idToken?.payload?.email;

    if (!sub) {
      console.warn("[getCurrentUser] No user sub found in session.");
      return null;
    }

    // Try to fetch the user
    const response = await client.graphql({
      query: getUser,
      variables: { id: sub },
    });

    let user = response?.data?.getUser;

    // Create if it doesn't exist
    if (!user) {
      const result = await client.graphql({
        query: createUser,
        variables: {
          input: {
            id: sub,
            sub,
            username,
            email,
            role: "User", // Default role or null
          },
        },
        authMode: "userPool",
      });

      user = result?.data?.createUser;
      console.log("[getCurrentUser] Created new user:", user);
    }

    return user;
  } catch (error) {
    console.error("[getCurrentUser] Failed:", error);
    return null;
  }
};
