import { Router } from "express";
import { getDb } from "../utils/db.utils";
import { Task, TaskSchema } from "../models/task.model";
import { ObjectId } from "mongodb";
import { validateData } from "../middleware/zod.middleware";

export const router = Router();

router.get("/", async (req, res) => {
  const db = getDb();
  console.log("router.get  tasks:");

  try {
    const tasks = await db.collection<Task>("tasks").find().toArray();
    console.log("router.get  tasks:", tasks);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500);
  }
});
router.post("/", validateData(TaskSchema), async (req, res) => {
  const task = req.body;
  console.log("router.post  task:", task);
  const db = getDb();

  try {
    const taskRes = await db.collection<Task>("tasks").insertOne(task);
    if (!taskRes.insertedId) res.status(500);
    res.status(200);
  } catch (error) {
    res.status(500);
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const query = { _id: ObjectId.createFromHexString(id) };

  try {
    const task = await db.collection<Task>("tasks").findOneAndDelete(query);
    if (!task) res.status(500);
    res.status(200);
  } catch (error) {
    res.status(500);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const task = TaskSchema.parse(req.body);
  const query = { _id: ObjectId.createFromHexString(id) };
  const db = getDb();

  try {
    const dbTask = await db
      .collection<Task>("tasks")
      .findOneAndUpdate(query, { $set: task });
    if (!dbTask) res.status(500);
    res.status(200);
  } catch (error) {
    res.status(500);
  }
});
