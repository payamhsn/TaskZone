import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Plus, MoreVertical, X } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

const BoardView = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board?.title || "");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      const [boardResponse, tasksResponse] = await Promise.all([
        axios.get(`/api/boards/${boardId}`),
        axios.get(`/api/boards/${boardId}/tasks`),
      ]);
      setBoard(boardResponse.data);
      setTasks(tasksResponse.data);
    } catch (err) {
      setError("Failed to fetch board data");
      console.error("Error fetching board data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const { data } = await axios.post(`/api/boards/${boardId}/lists`, {
        title: newListTitle,
      });
      setBoard({
        ...board,
        lists: [...board.lists, data],
      });
      setNewListTitle("");
      setShowAddList(false);
    } catch (err) {
      console.error("Error adding list:", err);
    }
  };

  const handleUpdateBoard = async (updates) => {
    try {
      const { data } = await axios.put(`/api/boards/${boardId}`, updates);
      setBoard(data);
    } catch (err) {
      console.error("Error updating board:", err);
    }
  };

  const handleTitleSubmit = async () => {
    if (editedTitle.trim() && editedTitle !== board.title) {
      await handleUpdateBoard({ title: editedTitle });
    }
    setIsEditingTitle(false);
  };

  const handleStarBoard = async () => {
    await handleUpdateBoard({ isStarred: !board.isStarred });
  };

  const handleBackgroundChange = async (color) => {
    await handleUpdateBoard({ background: color });
  };

  const handleAddTask = async (listId, title) => {
    if (!title.trim()) return;
    try {
      const { data } = await axios.post(`/api/boards/${boardId}/tasks`, {
        title,
        listId,
      });
      setTasks([...tasks, data]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log("Deleting task:", taskId);
      await axios.delete(`/api/boards/${boardId}/tasks/${taskId}`);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(tasks.find((task) => task._id === active.id));
  };
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    if (!activeTask) return;

    try {
      // Save original tasks state for rollback if needed
      const originalTasks = [...tasks];

      // Calculate new list ID and position
      const targetListId =
        over.data?.current?.sortable?.containerId || activeTask.listId;
      const targetTasks = tasks.filter((task) => task.listId === targetListId);
      const newPosition = targetTasks.length;

      // Create updated task
      const updatedTask = {
        ...activeTask,
        listId: targetListId,
        position: newPosition,
      };

      // Update local state first (optimistic update)
      const newTasks = tasks.map((task) =>
        task._id === activeTask._id ? updatedTask : task
      );

      // Update state immediately
      setTasks(newTasks);

      // Send update to backend
      const { data } = await axios.put(`/api/boards/${boardId}/tasks/reorder`, {
        tasks: [
          {
            id: activeTask._id,
            listId: targetListId,
            position: newPosition,
          },
        ],
      });

      // If successful, update with server response
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error moving task:", error);
      // Refresh data from server on error
      fetchBoardData();
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: board.background }}
    >
      {/* Board Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {isEditingTitle ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTitleSubmit();
              }}
              className="flex-1 mr-4"
            >
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-2xl font-bold bg-black/10 text-white px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-white/50"
                autoFocus
                onBlur={handleTitleSubmit}
              />
            </form>
          ) : (
            <h1
              className="text-2xl font-bold text-white cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
              onClick={() => {
                setEditedTitle(board.title);
                setIsEditingTitle(true);
              }}
            >
              {board.title}
            </h1>
          )}
          <div className="relative">
            <button
              onClick={() => setShowBoardMenu(!showBoardMenu)}
              className="text-white hover:bg-white/20 p-2 rounded-md"
            >
              <MoreVertical size={20} />
            </button>

            {showBoardMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Menu
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsEditingTitle(true);
                        setShowBoardMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Edit Title
                    </button>
                    <button
                      onClick={() => {
                        handleStarBoard();
                        setShowBoardMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      {board.isStarred
                        ? "Remove from Starred"
                        : "Add to Starred"}
                    </button>
                    <div className="border-t border-gray-200 my-2 pt-2">
                      <p className="text-sm text-gray-600 mb-2 px-3">
                        Background
                      </p>
                      <div className="flex flex-wrap gap-2 px-3">
                        {[
                          "#2D4059", // Navy Blue
                          "#437C90", // Steel Blue
                          "#5C9EAD", // Teal
                          "#885A5A", // Dusty Rose
                          "#4A5859", // Slate Gray
                          "#6B4423", // Brown
                        ].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              handleBackgroundChange(color);
                              setShowBoardMenu(false);
                            }}
                            className={`w-8 h-8 rounded-md ${
                              board.background === color
                                ? "ring-2 ring-blue-500 ring-offset-2"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 my-2 pt-2">
                      <button
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this board?"
                            )
                          ) {
                            try {
                              await axios.delete(`/api/boards/${boardId}`);
                              window.location.href = "/dashboard";
                            } catch (err) {
                              console.error("Error deleting board:", err);
                            }
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete Board
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {board.description && (
          <p className="text-white/80 mt-2">{board.description}</p>
        )}
      </div>

      {/* Lists Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {/* Lists */}
          {board.lists.map((list) => (
            <div
              key={list._id}
              className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4"
            >
              <h3 className="font-semibold mb-4">{list.title}</h3>

              <SortableContext
                id={list._id} // Add this
                items={tasks
                  .filter((task) => task.listId === list._id)
                  .map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3" data-list-id={list._id}>
                  {" "}
                  {/* Add this */}
                  {tasks
                    .filter((task) => task.listId === list._id)
                    .sort((a, b) => a.position - b.position)
                    .map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                        onDelete={() => handleDeleteTask(task._id)}
                      />
                    ))}
                </div>
              </SortableContext>

              {/* Add Task Button */}
              <button
                onClick={() => handleAddTask(list._id, "New Task")}
                className="mt-3 flex items-center gap-1 text-gray-600 hover:text-gray-800"
              >
                <Plus size={20} />
                Add a task
              </button>
            </div>
          ))}

          {/* Add List Button */}
          {showAddList ? (
            <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                className="w-full px-3 py-2 border rounded-md mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddList}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add List
                </button>
                <button
                  onClick={() => {
                    setShowAddList(false);
                    setNewListTitle("");
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddList(true)}
              className="flex-shrink-0 w-72 bg-gray-100/50 hover:bg-gray-100 rounded-lg p-4 flex items-center gap-2 text-gray-600"
            >
              <Plus size={20} />
              Add another list
            </button>
          )}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          boardId={boardId}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(
              tasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
              )
            );
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default BoardView;
