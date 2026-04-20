import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
pg.types.setTypeParser(1082, (value) => value);
pg.types.setTypeParser(1114, (value) => value);
pg.types.setTypeParser(1184, (value) => value);

export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
