import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
});

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lists: [listSchema],
    background: {
      type: String,
      default: "#2D4059", // Default background color
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
boardSchema.index({ owner: 1 });
boardSchema.index({ members: 1 });

const Board = mongoose.model("Board", boardSchema);

export default Board;
