import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";

const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded shadow-sm hover:shadow-md cursor-pointer 
        border border-transparent hover:border-gray-200 select-none
        ${isDragging ? "shadow-lg" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-gray-800 break-words flex-1">{task.title}</p>
        <button
          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            // Handle menu click
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {task.description && (
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: label.color + "20",
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Due date */}
      {task.dueDate && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
