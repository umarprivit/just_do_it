import Task from "../models/Task.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  const {
    title,
    description,
    category,
    location,
    budget,
    deadline,
    skillsRequired,
    urgency,
    scheduledAt,
  } = req.body;

  //validations
  if (
    !title ||
    !description ||
    !category ||
    !location ||
    !budget ||
    !deadline
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  try {
    const task = await Task.create({
      title,
      description,
      category,
      location,
      budget,
      deadline,
      skillsRequired: skillsRequired || [],
      urgency: urgency || "medium",
      scheduledAt,
      client: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    return res.status(400).json({
      error: err.message || "Error creating task",
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

// Add a bid to a task
export const addBid = async (req, res) => {
  const { taskId } = req.params;

  const bidderId = req.user._id;

  try {
    // Validation

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if task is still open for bidding
    if (task.status !== "open") {
      return res
        .status(400)
        .json({ error: "Task is no longer open for bidding" });
    }

    // Check if user is the task owner
    if (task.client.toString() === bidderId.toString()) {
      return res.status(400).json({ error: "Cannot bid on your own task" });
    }

    // Check if user has already bid
    const existingBid = task.bidders.find(
      (bid) => bid.user.toString() === bidderId.toString()
    );

    if (existingBid) {
      // Update existing bid

      existingBid.bidDate = new Date();
    } else {
      // Add new bid
      task.bidders.push({
        user: bidderId,

        bidDate: new Date(),
      });
    }

    await task.save();

    // Populate the bidder information
    await task.populate({
      path: "bidders.user",
      select: "name email profile.avatar",
    });

    res.status(200).json({
      message: existingBid
        ? "Bid updated successfully"
        : "Bid added successfully",
      task,
    });
  } catch (error) {
    console.error("Error adding bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Assign task to a specific bidder
export const assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { bidderId } = req.body;
  const clientId = req.user._id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is the task owner
    if (task.client.toString() !== clientId.toString()) {
      return res
        .status(403)
        .json({ error: "Only task owner can assign providers" });
    }

    // Check if task is still open
    if (task.status !== "open") {
      return res
        .status(400)
        .json({ error: "Task is no longer open for assignment" });
    }

    // Check if bidder exists in the bidders array
    const bidder = task.bidders.find(
      (bid) => bid.user.toString() === bidderId.toString()
    );

    if (!bidder) {
      return res
        .status(400)
        .json({ error: "Selected user has not bid on this task" });
    }

    // Assign the task
    task.assignedTo = bidderId;
    task.provider = bidderId; // Keep provider field for backward compatibility
    task.status = "assigned";

    await task.save();

    // Populate assigned user information
    await task.populate({
      path: "assignedTo",
      select: "name email profile.avatar",
    });

    // TODO: Send notification to assigned provider
    // TODO: Send notifications to other bidders that task was assigned

    res.status(200).json({
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all bids for a task (for task owner)
export const getTaskBids = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;

  try {
    const task = await Task.findById(taskId).populate({
      path: "bidders.user",
      select: "name email profile.avatar profile.rating profile.completedTasks",
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if user is the task owner
    if (task.client.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only task owner can view bids" });
    }

    res.status(200).json({
      bids: task.bidders,
      totalBids: task.bidders.length,
    });
  } catch (error) {
    console.error("Error fetching task bids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all tasks where user has bid
export const getMyBids = async (req, res) => {
  const userId = req.user._id;

  try {
    const tasks = await Task.find({
      "bidders.user": userId,
    })
      .populate("client", "name email profile.avatar")
      .populate("assignedTo", "name email profile.avatar")
      .sort({ createdAt: -1 });

    // Filter and format the response to include user's bid information
    const myBids = tasks.map((task) => {
      const myBid = task.bidders.find(
        (bid) => bid.user.toString() === userId.toString()
      );

      return {
        task: {
          _id: task._id,
          title: task.title,
          description: task.description,
          category: task.category,
          budget: task.budget,
          deadline: task.deadline,
          status: task.status,
          client: task.client,
          assignedTo: task.assignedTo,
          createdAt: task.createdAt,
        },
        myBid: {
          bidAmount: myBid.bidAmount,
          message: myBid.message,
          bidDate: myBid.bidDate,
        },
        isAssigned: task.assignedTo?.toString() === userId.toString(),
        totalBids: task.bidders.length,
      };
    });

    res.status(200).json(myBids);
  } catch (error) {
    console.error("Error fetching user bids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get task statistics and counts
export const getTaskStats = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get all tasks for the current user (as client)
    const userTasks = await Task.find({ client: userId });

    // Calculate statistics
    const totalTasks = userTasks.length;

    const activeTasks = userTasks.filter((task) =>
      ["open", "assigned", "accepted", "pending"].includes(task.status)
    ).length;

    const inProgressTasks = userTasks.filter(
      (task) => task.status === "in-progress"
    ).length;

    const completedTasks = userTasks.filter(
      (task) => task.status === "completed"
    ).length;

    // Calculate total spent (sum of budgets for completed tasks)
    const totalSpent = userTasks
      .filter((task) => task.status === "completed")
      .reduce((sum, task) => sum + (task.budget || 0), 0);

    // Calculate total bids across all user's tasks
    const totalBids = userTasks.reduce(
      (sum, task) => sum + task.bidders.length,
      0
    );

    const stats = {
      // Client stats
      client: {
        totalTasks,
        activeTasks,
        inProgressTasks,
        completedTasks,
        totalSpent,
        totalBidsReceived: totalBids,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all tasks with pagination and sorting
export const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      minBudget,
      maxBudget,
    } = req.query;

    // Build query object
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseFloat(minBudget);
      if (maxBudget) query.budget.$lte = parseFloat(maxBudget);
    }

    // Calculate pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination info
    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limitNumber);

    // Fetch tasks with pagination and sorting
    const tasks = await Task.find(query)
      .populate("client", "name email profile.avatar")
      .populate("assignedTo", "name email profile.avatar")
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limitNumber);

    // Format response with pagination info
    const response = {
      tasks,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalTasks,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
        limit: limitNumber,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
