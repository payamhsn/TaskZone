import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addBoardMember,
  addList,
  updateList,
  deleteList,
  reorderLists,
} from "../controllers/boardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Board routes
router.route("/").post(protect, createBoard).get(protect, getBoards);

router
  .route("/:id")
  .get(protect, getBoardById)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

router.route("/:id/members").post(protect, addBoardMember);

// List routes
router.route("/:id/lists").post(protect, addList);

router
  .route("/:id/lists/:listId")
  .put(protect, updateList)
  .delete(protect, deleteList);

router.route("/:id/lists/reorder").put(protect, reorderLists);

export default router;
