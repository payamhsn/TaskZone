import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    listId: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    labels: [
      {
        name: String,
        color: String,
      },
    ],
    dueDate: Date,
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
taskSchema.index({ boardId: 1 });
taskSchema.index({ listId: 1 });
taskSchema.index({ boardId: 1, listId: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
