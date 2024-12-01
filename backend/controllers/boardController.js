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

// @desc    Add new list to board
// @route   POST /api/boards/:id/lists
// @access  Private
const addList = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership or membership
  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to modify this board");
  }

  // Get highest position for new list
  const maxPosition = board.lists.reduce(
    (max, list) => Math.max(max, list.position),
    -1
  );

  board.lists.push({
    title,
    position: maxPosition + 1,
  });

  const updatedBoard = await board.save();
  res.status(201).json(updatedBoard.lists[updatedBoard.lists.length - 1]);
});

// @desc    Update list
// @route   PUT /api/boards/:id/lists/:listId
// @access  Private
const updateList = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  const { title, position } = req.body;

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership or membership
  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to modify this board");
  }

  const listIndex = board.lists.findIndex(
    (list) => list._id.toString() === req.params.listId
  );

  if (listIndex === -1) {
    res.status(404);
    throw new Error("List not found");
  }

  // Update list properties
  if (title) board.lists[listIndex].title = title;
  if (typeof position === "number") {
    // Reorder lists if position changed
    const oldPosition = board.lists[listIndex].position;
    if (position !== oldPosition) {
      board.lists.forEach((list) => {
        if (position > oldPosition) {
          if (list.position <= position && list.position > oldPosition) {
            list.position--;
          }
        } else {
          if (list.position >= position && list.position < oldPosition) {
            list.position++;
          }
        }
      });
      board.lists[listIndex].position = position;
    }
  }

  const updatedBoard = await board.save();
  res.json(updatedBoard.lists[listIndex]);
});

// @desc    Delete list
// @route   DELETE /api/boards/:id/lists/:listId
// @access  Private
const deleteList = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership
  if (board.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete lists");
  }

  const listIndex = board.lists.findIndex(
    (list) => list._id.toString() === req.params.listId
  );

  if (listIndex === -1) {
    res.status(404);
    throw new Error("List not found");
  }

  const deletedPosition = board.lists[listIndex].position;

  // Remove the list
  board.lists.splice(listIndex, 1);

  // Update positions of remaining lists
  board.lists.forEach((list) => {
    if (list.position > deletedPosition) {
      list.position--;
    }
  });

  await board.save();
  res.json({ message: "List removed" });
});

// @desc    Reorder lists
// @route   PUT /api/boards/:id/lists/reorder
// @access  Private
const reorderLists = asyncHandler(async (req, res) => {
  const { lists } = req.body;
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check ownership or membership
  if (
    board.owner.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to modify this board");
  }

  // Update positions for all lists
  lists.forEach(({ id, position }) => {
    const list = board.lists.find((l) => l._id.toString() === id);
    if (list) {
      list.position = position;
    }
  });

  const updatedBoard = await board.save();
  res.json(updatedBoard.lists);
});

export {
  addList,
  updateList,
  deleteList,
  reorderLists,
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addBoardMember,
};
