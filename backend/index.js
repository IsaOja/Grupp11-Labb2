import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import { ensureTables } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

ensureTables().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`✅ Server running on http://localhost:${port}`)
  );
});
