import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Plus, MoreVertical } from "lucide-react";
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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTaskToList, setAddingTaskToList] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const handleTaskUpdate = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(tasks.find((task) => task._id === active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    const overTask = tasks.find((task) => task._id === over.id);

    if (!activeTask) return;

    const activeListId = activeTask.listId;
    const overListId = overTask ? overTask.listId : over.id;

    // If task was dropped in a different list
    const isNewList = activeListId !== overListId;

    const updatedTasks = tasks.map((task) => {
      if (task._id === activeTask._id) {
        return { ...task, listId: overListId };
      }
      return task;
    });

    // Update positions
    const filteredTasks = updatedTasks.filter(
      (task) => task.listId === overListId
    );
    const oldIndex = filteredTasks.findIndex(
      (task) => task._id === activeTask._id
    );
    const newIndex = filteredTasks.findIndex(
      (task) => task._id === overTask?.id
    );

    const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex);

    // Update positions in the array
    const finalTasks = updatedTasks.map((task) => {
      if (task.listId === overListId) {
        const position = reorderedTasks.findIndex((t) => t._id === task._id);
        return { ...task, position };
      }
      return task;
    });

    setTasks(finalTasks);

    try {
      await axios.put(`/api/boards/${boardId}/tasks/reorder`, {
        tasks: finalTasks.map((task) => ({
          id: task._id,
          listId: task.listId,
          position: task.position,
        })),
      });
    } catch (err) {
      console.error("Error updating task positions:", err);
      // Revert to previous state on error
      setTasks(tasks);
    }
  };

  const handleAddTask = async (listId) => {
    if (!newTaskTitle.trim()) return;

    try {
      const { data } = await axios.post(`/api/boards/${boardId}/tasks`, {
        title: newTaskTitle,
        listId,
      });
      setTasks([...tasks, data]);
      setNewTaskTitle("");
      setAddingTaskToList(null);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: board.background }}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{board.title}</h1>
          <button className="text-white hover:bg-white/20 p-2 rounded-md">
            <MoreVertical size={20} />
          </button>
        </div>
        {board.description && (
          <p className="text-white/80 mt-2">{board.description}</p>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {board.lists.map((list) => {
            const listTasks = tasks
              .filter((task) => task.listId === list._id)
              .sort((a, b) => a.position - b.position);

            return (
              <div
                key={list._id}
                className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4"
              >
                <h3 className="font-semibold mb-4">{list.title}</h3>

                <SortableContext
                  items={listTasks.map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {listTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}
                  </div>
                </SortableContext>

                {addingTaskToList === list._id ? (
                  <div className="mt-3">
                    <textarea
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                      className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddTask(list._id)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add Task
                      </button>
                      <button
                        onClick={() => {
                          setAddingTaskToList(null);
                          setNewTaskTitle("");
                        }}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTaskToList(list._id)}
                    className="mt-3 flex items-center gap-1 text-gray-600 hover:text-gray-800"
                  >
                    <Plus size={20} />
                    Add a task
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            boardId={boardId}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}
      </DndContext>
    </div>
  );
};

export default BoardView;
