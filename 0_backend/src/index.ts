import "dotenv/config";

import { initDb, initExpress, initPhoenix } from "./services";

const start = async () => {
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

  await initExpress({ phoenix, db });
};

start();
