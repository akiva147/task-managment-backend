import { Router } from "express";
import { getDb } from "../utils/db.utils";
import { Task, TaskSchema } from "../models/task.model";
import { ObjectId } from "mongodb";
import { validateData } from "../middleware/zod.middleware";

export const router = Router();

router.get("/", async (req, res) => {
  const db = getDb();

  try {
    const tasks = await db.collection<Task[]>("tasks").find().toArray();
    res.status(200).json(tasks);
  } catch (error) {
    console.log("router.get  error:", error);
    res.status(500).send();
  }
});
router.put("/save", async (req, res) => {
  const db = getDb();

  try {
    const tasks = TaskSchema.array().parse(req.body);
    const updatePromises = tasks.map((task) => {
      const { _id, ...rest } = task;
      return db.collection("tasks").updateOne(
        { _id: ObjectId.createFromHexString(_id) }, // Assuming each task has a unique _id
        { $set: rest } // Update the task with the new data
      );
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    res.status(200).send();
  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).send();
  }
});

router.post(
  "/",
  // , validateData(TaskSchema)
  async (req, res) => {
    const { _id, ...task } = TaskSchema.parse(req.body);
    console.log("router.post  task:", task);
    const db = getDb();

    try {
      const taskRes = await db.collection("tasks").insertOne(task);
      if (!taskRes.insertedId) res.status(500).send();
      res.status(200).send();
    } catch (error) {
      console.log("router.post  error:", error);
      res.status(500).send();
    }
  }
);
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const query = { _id: ObjectId.createFromHexString(id) };

  try {
    const task = await db.collection("tasks").findOneAndDelete(query);
    if (!task) res.status(500).send();
    res.status(200).send();
  } catch (error) {
    console.log("router.delete  error:", error);
    res.status(500).send();
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const task = TaskSchema.parse(req.body);
  const query = { _id: ObjectId.createFromHexString(id) };
  const db = getDb();

  try {
    const dbTask = await db
      .collection("tasks")
      .findOneAndUpdate(query, { $set: task });
    if (!dbTask) res.status(500).send();
    res.status(200).send();
  } catch (error) {
    console.log("router.put  error:", error);
    res.status(500).send();
  }
});
