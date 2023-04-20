import express from "express";
import { promises } from "fs";
import winston from "winston";
import path from "path";

import grades from "./routes/grades.js";

const fs = promises;
const app = express();

const { combine, timestamp, label, printf } = winston.format;
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const jsonFile = path.join(process.cwd(), '/grades.json');

global.gradesFileJSON = jsonFile;
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "grades-control-api.log" }),
  ],
  format: combine(
    label({ label: "grades-control-api" }),
    timestamp(),
    logFormat
  ),
});

app.use(express.json());
app.use("/grades", grades);

app.listen(3000, async () => {
  try {
    await fs.readFile(gradesFileJSON, "utf-8");
  } catch (err) {
    const initalJson = {
      nextID: 1,
      accounts: [],
    };
    fs.writeFile(gradesFileJSON, JSON.stringify(initalJson)).catch((err) => {
      logger.error(err);
    });
  }
});
