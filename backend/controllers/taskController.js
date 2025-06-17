import Task from "../models/Task.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  const { title, description, category, location, budget, scheduledAt } =
    req.body;

  //validations
  if (
    !title ||
    !description ||
    !category ||
    !location ||
    !budget ||
    !scheduledAt
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const task = await Task.create({
      title,
      description,
      category,
      location,
      budget,
      scheduledAt,
      client: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    return res.status(400).json({
      error: err._message,
    });
  }
};

export const bookProvider = async (req, res) => {
  const { taskId, providerId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.provider = providerId;
  task.status = "pending";
  await task.save();

  // TODO: Send email / notification to provider

  res.json(task);
};

export const acceptBooking = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (!task.provider.equals(req.user._id))
    return res.status(403).json({ error: "Not authorized" });

  task.status = "accepted";
  await task.save();

  // TODO: Send email / notification to client

  res.json(task);
};

export const providerUpdateStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });
  if (!task.provider.equals(req.user._id))
    return res.status(403).json({ error: "Not authorized" });

  task.status = status;
  await task.save();
  res.json(task);
};

export const completeTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.status = "completed";
  await task.save();

  // TODO: Award points to both users
  await awardPoints(task.client._id, 10);
  await awardPoints(task.provider._id, 20);

  //   await sendEmail(
  //     task.client.email,
  //     "Task Completed",
  //     "Your task was completed successfully."
  //   );
  //   await sendEmail(
  //     task.provider.email,
  //     "Task Completed",
  //     "You successfully completed a task."
  //   );

  res.json(task);
};
