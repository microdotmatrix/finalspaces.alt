import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
  baseURL: process.env.BASE_URL!,
});

export const { signIn, signOut, signUp, useSession } = client;
