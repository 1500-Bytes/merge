import { NON_STANDARD_NODE_ENV } from "next/dist/lib/constants";

export const config = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV!,
  }
}
