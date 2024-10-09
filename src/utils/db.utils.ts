import { MongoClient, Db } from "mongodb";
import { validateEnvs } from "./env.utils";

let db: Db;

export const connectToDatabase = async () => {
  try {
    const { DB_CONNECTION, DB_NAME } = validateEnvs();
    const client = new MongoClient(DB_CONNECTION); // Replace with your MongoDB URI
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};
