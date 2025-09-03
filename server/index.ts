import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getVotes,
  postCredential,
  postProve,
  postVote,
  getPoll,
} from "./routes/zk";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ZK mock endpoints (support both with and without /api prefix for Netlify mapping)
  app.get("/api/poll", getPoll);
  app.get("/poll", getPoll);

  app.post("/api/credential", postCredential);
  app.post("/credential", postCredential);

  app.post("/api/prove", postProve);
  app.post("/prove", postProve);

  app.post("/api/vote", postVote);
  app.post("/vote", postVote);

  app.get("/api/results", getVotes);
  app.get("/results", getVotes);

  return app;
}
