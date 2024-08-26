const http = require("http");

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import Phoenix from "phoenix-server-js";
import {
  countInvoices,
  createInvoice,
  getAllInvoices,
  getInvoiceByInvoice,
  updateInvoiceStatus,
} from "./_db";

const PORT = process.env.PORT || 3000;

type Props = {
  phoenix: Phoenix;
  db: any;
};

const initExpress = async ({ phoenix, db }: Props) => {
  try {
    const app = express();
    let connectedClients: any = {};

    const phoenixWs = phoenix.websocket();

    phoenixWs.on("message", async (message: any) => {
      try {
        const messageFromBuffer = Buffer.from(message, "base64").toString();
        const messageParsed = JSON.parse(messageFromBuffer);

        const incomingPayment = await phoenix.getIncomingPayment({
          paymentHash: messageParsed?.paymentHash,
        });

        if (!incomingPayment) {
          console.log("Incoming payment not found");
          return;
        }

        const invoiceUpdated = await getInvoiceByInvoice(
          db,
          incomingPayment?.invoice
        );

        if (!invoiceUpdated) {
          console.log("Invoice not found");
          return;
        }

        // (timestamp) deactivate_at = current date + amount * 10 seconds
        const deactivate_at = new Date();
        deactivate_at.setSeconds(
          deactivate_at.getSeconds() + invoiceUpdated?.amount * 10
        );
        const timestamp = Math.floor(deactivate_at.getTime() / 1000);

        const updatedInvoice = await updateInvoiceStatus(
          `${timestamp}`,
          incomingPayment?.invoice,
          "paid",
          db
        );

        if (!updatedInvoice) {
          console.log("Invoice not found");
          return;
        }

        const invoiceUpdated2 = await getInvoiceByInvoice(
          db,
          incomingPayment?.invoice
        );

        if (!invoiceUpdated2) {
          console.log("Invoice not found");
          return;
        }

        emitEvent(
          connectedClients,
          messageParsed?.externalId,
          "paid",
          JSON.stringify(invoiceUpdated2)
        );

        emitEventAll(
          connectedClients,
          "new-message",
          JSON.stringify(invoiceUpdated2)
        );
      } catch (error) {
        console.log(error);
      }
    });

    app.use(cors());
    app.use(bodyParser.json());

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      connectedClients[socket.id] = socket;
      console.log(
        `Total users connected: ${Object.keys(connectedClients).length}`
      );

      emitEventAll(
        connectedClients,
        "users-connected",
        Object.keys(connectedClients).length
      );

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        delete connectedClients[socket.id];
        console.log(
          `Total users connected: ${Object.keys(connectedClients).length}`
        );

        emitEventAll(
          connectedClients,
          "users-connected",
          Object.keys(connectedClients).length
        );
      });
    });

    app.get("/", (req, res) => {
      res.json({ message: "Hello World!" });
    });

    app.get("/invoices/count", async (req, res) => {
      try {
        const { totalActive, totalExpired } = await countInvoices(db);

        return res.json({ totalActive, totalExpired });
      } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/invoices", async (req, res) => {
      try {
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        const offset = (pageNumber - 1) * limitNumber;

        const invoices = await getAllInvoices(db, limitNumber, offset);

        return res.json({ invoices });
      } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/new-invoice", async (req, res) => {
      try {
        const { message, amount, websocket_id, lat_long } = req.body;

        // (timestamp) deactivate_at = current date + amount * 10 seconds
        const deactivate_at = new Date();
        deactivate_at.setSeconds(deactivate_at.getSeconds() + amount * 10);
        const timestamp = Math.floor(deactivate_at.getTime() / 1000);

        if (!message || !amount || !websocket_id) {
          return res.status(400).json({ error: "Missing parameters" });
        }

        const invoiceData = await phoenix.receiveLightningPayment({
          description: "new-invoice",
          amountSat: amount,
          externalId: websocket_id,
        });

        if (!invoiceData) {
          return res.status(500).json({ error: "Error creating invoice" });
        }

        await createInvoice({
          db,
          websocket_id,
          deactivate_at: `${timestamp}`,
          lat_long,
          message,
          invoice_bolt11: invoiceData?.serialized,
          invoice: JSON.stringify(invoiceData),
          amount,
        });

        return res.json({ invoiceData });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    return app;
  } catch (error: any) {
    console.log(error);
  }
};

const emitEventAll = (connectedClients: any, event: string, data: any) => {
  try {
    Object.keys(connectedClients).forEach((key) => {
      connectedClients[key].emit(event, data);
    });
  } catch (error) {
    console.log(error);
  }
};

const emitEvent = (
  connectedClients: any,
  websocket_id: string,
  event: string,
  data: any
) => {
  try {
    if (connectedClients[websocket_id]) {
      connectedClients[websocket_id].emit(event, data);
      console.log(`Message sent to ${websocket_id}: ${data}`);
    } else {
      console.log(`Socket ${websocket_id} not found`);
    }
  } catch (error) {
    console.log(error);
  }
};

export { initExpress };
