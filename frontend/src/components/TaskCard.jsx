// import React, { useState } from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { MoreHorizontal, Pencil, Trash2, Tag, Clock, User } from "lucide-react";
// import axios from "axios";

// const TaskCard = ({ task, onClick, onUpdate, onDelete, boardId }) => {
//   const [showMenu, setShowMenu] = useState(false);

//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: task._id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const handleDeleteTask = async () => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       try {
//         await axios.delete(`/api/boards/${boardId}/tasks/${task._id}`);
//         onDelete(task._id);
//       } catch (err) {
//         console.error("Error deleting task:", err);
//       }
//     }
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className={`bg-white p-3 rounded shadow-sm hover:shadow-md cursor-pointer
//         border border-transparent hover:border-gray-200 select-none group relative
//         ${isDragging ? "shadow-lg" : ""}`}
//     >
//       <div className="flex justify-between items-start gap-2">
//         <p className="text-gray-800 break-words flex-1" onClick={onClick}>
//           {task.title}
//         </p>
//         <div className="relative">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowMenu(!showMenu);
//             }}
//             className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
//           >
//             <MoreHorizontal size={16} />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 border">
//               <div className="py-1">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onClick(); // Open task modal for editing
//                     setShowMenu(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                 >
//                   <Pencil size={14} />
//                   Edit Task
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // Add label functionality will be handled in the modal
//                     onClick();
//                     setShowMenu(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                 >
//                   <Tag size={14} />
//                   Add Label
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // Set due date functionality will be handled in the modal
//                     onClick();
//                     setShowMenu(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                 >
//                   <Clock size={14} />
//                   Set Due Date
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // Assign member functionality will be handled in the modal
//                     onClick();
//                     setShowMenu(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                 >
//                   <User size={14} />
//                   Assign Member
//                 </button>
//                 <div className="border-t border-gray-200 my-1"></div>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteTask();
//                     setShowMenu(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                 >
//                   <Trash2 size={14} />
//                   Delete Task
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {task.description && (
//         <p className="text-gray-500 text-sm mt-2 line-clamp-2">
//           {task.description}
//         </p>
//       )}

//       {/* Labels */}
//       {task.labels && task.labels.length > 0 && (
//         <div className="flex flex-wrap gap-1 mt-2">
//           {task.labels.map((label, index) => (
//             <span
//               key={index}
//               className="px-2 py-0.5 rounded text-xs"
//               style={{
//                 backgroundColor: label.color + "20",
//                 color: label.color,
//               }}
//             >
//               {label.name}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Due date */}
//       {task.dueDate && (
//         <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
//           <Clock size={12} />
//           <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
//         </div>
//       )}

//       {/* Assigned Members (if implemented) */}
//       {task.assignedTo && task.assignedTo.length > 0 && (
//         <div className="flex items-center gap-1 mt-2">
//           <div className="flex -space-x-2">
//             {task.assignedTo.map((member, index) => (
//               <div
//                 key={index}
//                 className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
//                 title={member.name}
//               >
//                 {member.name[0]}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskCard;

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Pencil, Trash2, Tag, Clock, User } from "lucide-react";

const TaskCard = ({ task, onClick, onDelete, boardId }) => {
  const [showMenu, setShowMenu] = useState(false);

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

  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (window.confirm("Are you sure you want to delete this task?")) {
      setShowMenu(false); // Close the menu
      onDelete(); // Call the delete function passed from parent
    }
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
    >
      <div className="flex justify-between items-start gap-2">
        <p
          className="text-gray-800 break-words flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {task.title}
        </p>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Pencil size={14} />
                  Edit Task
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show task details if they exist */}
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
          <Clock size={12} />
          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
