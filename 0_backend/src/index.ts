import "dotenv/config";

import { initDb, initExpress, initPhoenix, initNostr } from "./services";

export const start = async () => {
  const db = await initDb();

  if (!db) {
    console.error("Error initializing database");
    return;
  }

  const phoenix = await initPhoenix();

  if (!phoenix) {
    console.error("Error initializing PhoenixD");
    return;
  }

  const { pool, sk } = await initNostr();

  await initExpress({ phoenix, db, pool, sk });
};

start();
