import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export async function signIn({
  data,
}: {
  data: { email: string; password: string };
}) {
  const res = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });
  return res;
}

export async function signUp({
  data,
}: {
  data: { email: string; password: string; name: string };
}) {
  const res = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });
  return res;
}
