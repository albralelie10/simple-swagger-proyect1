// const express= require("express")
// const morgan = require("morgan")
// const cors=require("cors")
// const low=require("lowdb")

import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import router from "./routes/book.js";

const PORT = 3000;
const app = express();

// Remember to set type: module in package.json or use .mjs extension



// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file)
const defaultData = { books: [] }
const db = new Low(adapter, defaultData)

// Read data from JSON file, this will set db.data content
// If JSON file doesn't exist, defaultData is used instead
await db.read();

// Create and query items using plain JavaScript

// If you don't want to type db.data everytime, you can use destructuring assignment

// Do NOT write db.data content to file here
// db.write();

app.db = db;

app.use(cors());
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => console.log("Server running"));


