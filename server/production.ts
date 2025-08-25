// Production server utilities - NO VITE IMPORTS
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

const logger = console;

export function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  logger.info(`${formattedTime} [express] ${message}`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve("dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}.\nPlease build the client first.`,
    );
  }

  // Serve static files from the build directory
  app.use(express.static(distPath));

  // Catch-all handler for SPA routing
  app.get("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Index file not found");
    }
  });
}