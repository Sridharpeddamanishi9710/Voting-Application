import express from 'express';
const app = express();
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import db from './db.js';
import bodyParser from 'body-parser';


// For ES modules (__dirname workaround)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser, CORS, JSON setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Express API routes (these must be BEFORE the React catch-all)
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// ---- REACT BUILD SETUP (for production deployment) ----

// Get __dirname in ES Modules
// Serve static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// SPA catch-all for React (must be last!)
// This matches everything not previously handled and does NOT use 'path-to-regexp'
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});



// ---- RUN SERVER ----

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
