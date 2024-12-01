import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";
import Board from "../models/boardModel.js";

// @desc    Create a new task
// @route   POST /api/boards/:boardId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, listId } = req.body;
  const boardId = req.params.boardId;

  // Check if board exists and user has access
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to create tasks in this board");
  }

  // Get highest position in the list
  const highestPositionTask = await Task.findOne({ listId }).sort({
    position: -1,
  });
  const position = highestPositionTask ? highestPositionTask.position + 1 : 0;

  const task = await Task.create({
    title,
    description,
    boardId,
    listId,
    position,
  });

  res.status(201).json(task);
});

// @desc    Get all tasks for a board
// @route   GET /api/boards/:boardId/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const boardId = req.params.boardId;

  // Check board access
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to view tasks in this board");
  }

  const tasks = await Task.find({ boardId }).sort({ position: 1 });

  res.json(tasks);
});

// @desc    Get single task
// @route   GET /api/boards/:boardId/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check board access
  const board = await Board.findById(task.boardId);
  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to view this task");
  }

  res.json(task);
});

// @desc    Update task
// @route   PUT /api/boards/:boardId/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check board access
  const board = await Board.findById(task.boardId);
  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to update this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  res.json(updatedTask);
});

// // @desc    Delete a task
// // @route   DELETE /api/boards/:boardId/tasks/:id
// // @access  Private
// const deleteTask = asyncHandler(async (req, res) => {
//   const boardId = req.params.boardId;
//   const taskId = req.params.id;

//   // First check if the board exists and user has access
//   const board = await Board.findById(boardId);
//   if (!board) {
//     res.status(404);
//     throw new Error("Board not found");
//   }

//   // Check if user has permission to modify this board
//   if (
//     board.owner.toString() !== req.user._id.toString() &&
//     !board.members.includes(req.user._id)
//   ) {
//     res.status(403);
//     throw new Error("Not authorized to modify tasks in this board");
//   }

//   const task = await Task.findOne({ _id: taskId, boardId });

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   await task.deleteOne();

//   // Update positions of remaining tasks in the same list
//   const tasksInList = await Task.find({ boardId, listId: task.listId });
//   for (const remainingTask of tasksInList) {
//     if (remainingTask.position > task.position) {
//       remainingTask.position -= 1;
//       await remainingTask.save();
//     }
//   }

//   res.json({ message: "Task removed" });
// });

const deleteTask = asyncHandler(async (req, res) => {
  console.log("Delete Task Controller Hit", {
    taskId: req.params.id,
    boardId: req.params.boardId,
  });

  try {
    // Find task by both taskId and boardId
    const task = await Task.findOne({
      _id: req.params.id,
      boardId: req.params.boardId, // Add this condition
    });

    console.log("Found task:", task);

    if (!task) {
      console.log("Task not found");
      res.status(404);
      throw new Error("Task not found");
    }

    // Check if board exists and user has access
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    // Check if user has permission
    if (
      board.owner.toString() !== req.user._id.toString() &&
      !board.members.includes(req.user._id)
    ) {
      res.status(403);
      throw new Error("Not authorized to delete tasks in this board");
    }

    // Delete the task
    await task.deleteOne();
    console.log("Task deleted successfully");

    // Update positions of remaining tasks in the same list
    await Task.updateMany(
      {
        boardId: req.params.boardId,
        listId: task.listId,
        position: { $gt: task.position },
      },
      { $inc: { position: -1 } }
    );

    res.json({ message: "Task removed", taskId: req.params.id });
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw error;
  }
});

// @desc    Update task positions (for drag and drop)
// @route   PUT /api/boards/:boardId/tasks/reorder
// @access  Private
const reorderTasks = asyncHandler(async (req, res) => {
  const { tasks: updatedTasks } = req.body;
  const boardId = req.params.boardId;

  console.log("Reorder request received:", {
    boardId,
    updatedTasks,
  });

  try {
    // Verify board exists and user has access
    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    // Update each task
    const updatePromises = updatedTasks.map(({ id, listId, position }) =>
      Task.findOneAndUpdate(
        { _id: id, boardId },
        { listId, position },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Get all updated tasks
    const allTasks = await Task.find({ boardId }).sort({ position: 1 });

    console.log("Tasks reordered successfully");
    res.json(allTasks);
  } catch (error) {
    console.error("Error in reorderTasks:", error);
    throw error;
  }
});

// @desc    Assign task to user
// @route   POST /api/boards/:boardId/tasks/:id/assign
// @access  Private
const assignTask = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check board access and if user is board member
  const board = await Board.findById(task.boardId);
  if (!board.members.includes(userId) && board.owner.toString() !== userId) {
    res.status(400);
    throw new Error("User must be a board member to be assigned");
  }

  if (!task.assignedTo.includes(userId)) {
    task.assignedTo.push(userId);
    await task.save();
  }

  res.json(task);
});

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  reorderTasks,
  assignTask,
};
