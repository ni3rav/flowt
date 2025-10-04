import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins/organization";
import { ac, admin, manager, employee } from "./permissions";

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
        employee,
        manager,
        admin,
      },
      schema: {
        organization: {
          additionalFields: {
            country: {
              type: "string",
              required: false,
              defaultValue: "IN",
              input: false,
            },
          },
        },
      },
    }),
    nextCookies(),
  ],
});
