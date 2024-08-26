import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";

async function openDb() {
  try {
    return await open({
      filename: "./data/database.db",
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function initDb() {
  try {
    const db = await openDb();

    if (!db) return null;

    db.exec(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        websocket_id TEXT,
        message TEXT,
        invoice_bolt11 TEXT,
        invoice TEXT,
        amount INTEGER,
        status TEXT,
        lat_long TEXT,
        deactivate_at TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);

    return db;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function createInvoice({
  db,
  websocket_id,
  message,
  invoice_bolt11,
  invoice,
  amount,
  deactivate_at,
  lat_long,
}: {
  db: Database;
  websocket_id: string;
  message: string;
  invoice_bolt11: string;
  invoice: string;
  amount: number;
  deactivate_at: string;
  lat_long: string;
}) {
  if (!db) return null;

  const result = db.run(
    `
    INSERT INTO invoices (
        websocket_id,
        message,
        invoice_bolt11,
        invoice,
        amount,
        status,
        lat_long,
        deactivate_at,
        created_at,
        updated_at
    ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        'waiting_payment',
        ?,
        ?,
        datetime('now'),
        datetime('now')
    )
  `,
    [
      websocket_id,
      message,
      invoice_bolt11,
      JSON.stringify(invoice),
      amount,
      lat_long,
      deactivate_at,
    ]
  );

  return result;
}

async function checkInvoiceExists(invoice: string, db: any) {
  if (!db) return null;

  try {
    return db.get(
      `
        SELECT * FROM invoices
        WHERE invoice = ?
      `,
      [invoice]
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function countInvoices(db: any) {
  if (!db) return { totalActive: 0, totalExpired: 0 };

  try {
    const totalActive = await db.get(
      `
      SELECT COUNT(*) as count
      FROM invoices 
      WHERE 
        status = 'paid'
        AND deactivate_at > strftime('%s', 'now')
      `
    );

    const totalExpired = await db.get(
      `
      SELECT COUNT(*) as count
      FROM invoices 
      WHERE 
        status = 'paid'
        AND deactivate_at <= strftime('%s', 'now')
      `
    );

    return {
      totalActive: totalActive.count,
      totalExpired: totalExpired.count,
    };
  } catch (error) {
    console.error(error);
    return { totalActive: 0, totalExpired: 0 };
  }
}

async function getAllInvoices(db: any, limit: number, offset: number) {
  if (!db) return null;

  try {
    return await db.all(
      `
      SELECT 
        message,
        amount,
        lat_long,
        deactivate_at,
        updated_at
      FROM invoices 
      WHERE 
        message IS NOT NULL
        AND status = 'paid'
        AND deactivate_at > strftime('%s', 'now')
      ORDER BY deactivate_at DESC
      LIMIT ?
      OFFSET ?
      `,
      [limit, offset]
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getInvoiceByInvoice(db: any, invoice: string) {
  if (!db) return null;

  try {
    return db.get(
      `
      SELECT 
        *
      FROM invoices
      WHERE invoice_bolt11 = ?
      `,
      [invoice]
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateInvoiceStatus(
  deactivate_at: string,
  invoice_bolt11: string,
  status: string,
  db: any
) {
  if (!db) return null;

  try {
    return db.run(
      `
    UPDATE invoices
    SET 
        deactivate_at = ?,
        status = ?,
        updated_at = datetime('now')
    WHERE invoice_bolt11 = ?
  `,
      [deactivate_at, status, invoice_bolt11]
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  initDb,
  createInvoice,
  updateInvoiceStatus,
  checkInvoiceExists,
  getAllInvoices,
  getInvoiceByInvoice,
  countInvoices,
};
