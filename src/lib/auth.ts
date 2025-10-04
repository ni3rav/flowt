import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins/organization";
import { ac, admin, member, owner } from "./permissions";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.user,
    },
  }),
  plugins: [
    organization({
      ac,
      roles: {
        member,
        admin,
        owner,
      },
    }),
    nextCookies(),
  ],
});
