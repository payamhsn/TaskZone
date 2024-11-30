import asyncHandler from "express-async-handler";
import Board from "../models/boardModel.js";

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const board = await Board.create({
    title,
    description,
    owner: req.user._id,
    lists: [
      { title: "To Do", position: 0 },
      { title: "In Progress", position: 1 },
      { title: "Done", position: 2 },
    ],
  });

  res.status(201).json(board);
});

// @desc    Get all boards for logged in user
// @route   GET /api/boards
// @access  Private
const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  }).sort({ createdAt: -1 });

  res.json(boards);
});

// @desc    Get single board by ID
// @route   GET /api/boards/:id
// @access  Private
const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check if user has access to this board
  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to access this board");
  }

  res.json(board);
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this board");
  }

  const { title, description, background } = req.body;

  board.title = title || board.title;
  board.description = description || board.description;
  board.background = background || board.background;

  const updatedBoard = await board.save();

  res.json(updatedBoard);
});

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this board");
  }

  await board.deleteOne();

  res.json({ message: "Board removed" });
});

// @desc    Add member to board
// @route   POST /api/boards/:id/members
// @access  Private
const addBoardMember = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  const { userId } = req.body;

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to add members");
  }

  // Check if member already exists
  if (board.members.includes(userId)) {
    res.status(400);
    throw new Error("User is already a member of this board");
  }

  board.members.push(userId);
  await board.save();

  res.json(board);
});

export {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addBoardMember,
};
