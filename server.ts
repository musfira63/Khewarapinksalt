import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 15MB limit for base64 screenshot uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const ORDERS_FILE = path.join(process.cwd(), "orders.json");
const INQUIRIES_FILE = path.join(process.cwd(), "inquiries.json");

// Ensure data files exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf8");
}
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Live Search Grounded News & Scientific Findings Endpoint
app.get("/api/khewra-news", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: false,
        message: "GEMINI_API_KEY not set",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        'Search the web for recent scientific research, geological findings, health studies, or global trade news about the Khewra Salt Mine and unrefined Himalayan Pink Salt from Pakistan. Return a valid JSON object with format: {"summary": "Brief 2-sentence executive summary", "findings": [{"title": "Clear concise headline", "description": "1-2 sentence detailed insight", "tag": "Scientific, Health, Industry, or Origin"}]}',
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const content = response.text || "";
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({
        title: web.title || web.uri,
        uri: web.uri,
      }));

    res.json({
      success: true,
      content,
      sources,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[GEMINI SEARCH GROUNDING ERROR]", error?.message || error);
    res.status(500).json({
      success: false,
      error: "Failed to perform search-grounded research.",
    });
  }
});

// Submit a new contact inquiry
app.post("/api/inquiries", (req, res) => {
  try {
    const { name, email, phone, reason, activeSegment, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required contact fields (name, email, message)." });
    }

    const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
    const inquiries = JSON.parse(fileContent);

    const inquiryId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const targetEmail =
      reason?.includes("Wholesale") || activeSegment === "wholesale"
        ? "Almusfiraenterprises@gmail.com"
        : "khewarapinksalt@gmail.com";

    const newInquiry = {
      inquiryId,
      name,
      email,
      phone: phone || "Not specified",
      reason: reason || "General Inquiry",
      activeSegment: activeSegment || "wholesale",
      message,
      targetEmail,
      status: "Unread",
      date: new Date().toLocaleString(),
    };

    inquiries.unshift(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");

    console.log(`[INSTANT EMAIL DISPATCH] Inquiry ${inquiryId} logged & routed to ${targetEmail} from ${email}`);

    res.json({ success: true, inquiry: newInquiry, dispatchedTo: targetEmail });
  } catch (error: any) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({ error: "Failed to record contact inquiry." });
  }
});

// Submit a new order
app.post("/api/orders", (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      currency,
      method,
      screenshot, // base64 string
      screenshotName,
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required order fields." });
    }

    const fileContent = fs.readFileSync(ORDERS_FILE, "utf8");
    const orders = JSON.parse(fileContent);

    const orderNumber = `KW-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      currency,
      method,
      screenshot,
      screenshotName,
      status: "Pending",
      date: new Date().toLocaleString(),
    };

    orders.unshift(newOrder); // Add to the beginning so newest is first
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");

    res.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to process and save order." });
  }
});

// Secure endpoint to get all orders for admin
app.post("/api/admin/orders", (req, res) => {
  try {
    const { passcode } = req.body;
    const requiredPasscode = process.env.ADMIN_PASSCODE || "saltlampadmin";

    if (!passcode || passcode !== requiredPasscode) {
      return res.status(401).json({ error: "Unauthorized: Invalid administrator passcode." });
    }

    const fileContent = fs.readFileSync(ORDERS_FILE, "utf8");
    const orders = JSON.parse(fileContent);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// Secure endpoint to update order status
app.post("/api/admin/update-status", (req, res) => {
  try {
    const { passcode, orderNumber, status } = req.body;
    const requiredPasscode = process.env.ADMIN_PASSCODE || "saltlampadmin";

    if (!passcode || passcode !== requiredPasscode) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const fileContent = fs.readFileSync(ORDERS_FILE, "utf8");
    const orders = JSON.parse(fileContent);

    const idx = orders.findIndex((o: any) => o.orderNumber === orderNumber);
    if (idx === -1) {
      return res.status(404).json({ error: "Order not found." });
    }

    orders[idx].status = status;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");

    res.json({ success: true, order: orders[idx] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status." });
  }
});

// Secure endpoint to delete an order
app.post("/api/admin/delete-order", (req, res) => {
  try {
    const { passcode, orderNumber } = req.body;
    const requiredPasscode = process.env.ADMIN_PASSCODE || "saltlampadmin";

    if (!passcode || passcode !== requiredPasscode) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const fileContent = fs.readFileSync(ORDERS_FILE, "utf8");
    let orders = JSON.parse(fileContent);

    const initialLength = orders.length;
    orders = orders.filter((o: any) => o.orderNumber !== orderNumber);

    if (orders.length === initialLength) {
      return res.status(404).json({ error: "Order not found." });
    }

    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
    res.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order." });
  }
});

// Secure endpoint to get all inquiries for admin
app.post("/api/admin/inquiries", (req, res) => {
  try {
    const { passcode } = req.body;
    const requiredPasscode = process.env.ADMIN_PASSCODE || "saltlampadmin";

    if (!passcode || passcode !== requiredPasscode) {
      return res.status(401).json({ error: "Unauthorized: Invalid administrator passcode." });
    }

    const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
    const inquiries = JSON.parse(fileContent);
    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact inquiries." });
  }
});

// Secure endpoint to update inquiry status
app.post("/api/admin/update-inquiry-status", (req, res) => {
  try {
    const { passcode, inquiryId, status } = req.body;
    const requiredPasscode = process.env.ADMIN_PASSCODE || "saltlampadmin";

    if (!passcode || passcode !== requiredPasscode) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
    const inquiries = JSON.parse(fileContent);

    const idx = inquiries.findIndex((iq: any) => iq.inquiryId === inquiryId);
    if (idx === -1) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    inquiries[idx].status = status;
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");

    res.json({ success: true, inquiry: inquiries[idx] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update inquiry status." });
  }
});

// Secure endpoint to delete an inquiry
app.post("/api/admin/delete-inquiry", (req, res) => {
  try {
    const { passcode, inquiryId } = req.body;
    const requiredPasscode = process.env.ADMIN_PASSCODE || "saltlampadmin";

    if (!passcode || passcode !== requiredPasscode) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const fileContent = fs.readFileSync(INQUIRIES_FILE, "utf8");
    let inquiries = JSON.parse(fileContent);

    const initialLength = inquiries.length;
    inquiries = inquiries.filter((iq: any) => iq.inquiryId !== inquiryId);

    if (inquiries.length === initialLength) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
    res.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete inquiry." });
  }
});

// Integrate Vite dev server or serve static assets
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
