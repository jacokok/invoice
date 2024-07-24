import { drizzle } from "drizzle-orm/libsql";
import * as dotenv from "dotenv";
dotenv.config();

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

import { createClient } from "@libsql/client";
import { schema } from ".";

const client = createClient({ url: DATABASE_URL ?? "", authToken: DATABASE_AUTH_TOKEN });
export const db = drizzle(client, { schema });
