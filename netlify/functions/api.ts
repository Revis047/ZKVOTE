import serverless from "serverless-http";
import express from "express";
import { createServer } from "../../server";

const app = express();

// Mount the app under the Netlify functions base path so routes like
// /.netlify/functions/api/prove map correctly to our internal /prove handler
app.use("/.netlify/functions/api", createServer());

export const handler = serverless(app);
