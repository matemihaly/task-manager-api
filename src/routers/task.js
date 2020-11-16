import express from "express";
import { Task } from "../models/task.js";
import { auth } from "../middleware/auth.js";

export const taskRouter = new express.Router();

taskRouter.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    composer: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET /tasks?isCompleted=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt_desc

taskRouter.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.isCompleted) {
    match.isCompleted = req.query.isCompleted === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send();
  }
});

taskRouter.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, composer: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "isCompleted"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates..." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      composer: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      composer: req.user._id,
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});
