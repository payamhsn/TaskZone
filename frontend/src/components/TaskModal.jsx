import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Calendar, Tag, User, Clock } from "lucide-react";

const TaskModal = ({ task, boardId, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [loading, setLoading] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#2563eb" });

  const colors = [
    "#2563eb", // blue
    "#16a34a", // green
    "#dc2626", // red
    "#ca8a04", // yellow
    "#9333ea", // purple
    "#57534e", // gray
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `/api/boards/${boardId}/tasks/${task._id}`,
        {
          title,
          description,
          dueDate,
        }
      );
      onUpdate(data);
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLabel = async () => {
    if (!newLabel.name) return;

    try {
      const updatedLabels = [...(task.labels || []), newLabel];
      const { data } = await axios.put(
        `/api/boards/${boardId}/tasks/${task._id}`,
        {
          labels: updatedLabels,
        }
      );
      onUpdate(data);
      setNewLabel({ name: "", color: "#2563eb" });
      setShowLabelPicker(false);
    } catch (err) {
      console.error("Error adding label:", err);
    }
  };

  const handleRemoveLabel = async (labelToRemove) => {
    try {
      const updatedLabels = task.labels.filter(
        (label) =>
          label.name !== labelToRemove.name ||
          label.color !== labelToRemove.color
      );
      const { data } = await axios.put(
        `/api/boards/${boardId}/tasks/${task._id}`,
        {
          labels: updatedLabels,
        }
      );
      onUpdate(data);
    } catch (err) {
      console.error("Error removing label:", err);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSubmit}
              className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none p-1 flex-1"
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Labels */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Labels</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.labels?.map((label, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-sm flex items-center gap-1"
                  style={{
                    backgroundColor: label.color + "20",
                    color: label.color,
                  }}
                >
                  {label.name}
                  <button
                    onClick={() => handleRemoveLabel(label)}
                    className="hover:bg-black/10 rounded p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setShowLabelPicker(true)}
                className="px-2 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Add label
              </button>
            </div>

            {showLabelPicker && (
              <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                <input
                  type="text"
                  value={newLabel.name}
                  onChange={(e) =>
                    setNewLabel({ ...newLabel, name: e.target.value })
                  }
                  placeholder="Label name"
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex gap-2 mb-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewLabel({ ...newLabel, color })}
                      className={`w-6 h-6 rounded-full ${
                        newLabel.color === color ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowLabelPicker(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLabel}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Due Date
              </span>
            </div>
            <input
              type="date"
              value={
                dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""
              }
              onChange={(e) => {
                setDueDate(e.target.value);
                handleSubmit();
              }}
              className="p-2 border rounded w-full max-w-xs"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">
                Description
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSubmit}
              placeholder="Add a more detailed description..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          {/* Activity Log Placeholder */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Activity
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Created {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
