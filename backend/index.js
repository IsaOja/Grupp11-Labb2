import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import { ensureTables } from "./db.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/wishlist-items", itemRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "dist", "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "public", "index.html"));
});

ensureTables().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`✅ Server running on http://localhost:${port}`)
  );
});
