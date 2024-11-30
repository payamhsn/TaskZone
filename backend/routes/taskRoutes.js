import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  reorderTasks,
  assignTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true }); // Enable access to boardId param

router.route("/").post(protect, createTask).get(protect, getTasks);

router.route("/reorder").put(protect, reorderTasks);

router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route("/:id/assign").post(protect, assignTask);

export default router;
