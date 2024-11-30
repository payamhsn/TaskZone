import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, Star, Clock, Loader2, Users, Search } from "lucide-react";

const DashboardPage = () => {
  const [boards, setBoards] = useState([]);
  const [starredBoards, setStarredBoards] = useState([]);
  const [recentBoards, setRecentBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardData, setNewBoardData] = useState({
    title: "",
    description: "",
    background: "#2D4059",
  });

  const backgroundColors = [
    "#2D4059", // Navy Blue
    "#437C90", // Steel Blue
    "#5C9EAD", // Teal
    "#885A5A", // Dusty Rose
    "#4A5859", // Slate Gray
    "#6B4423", // Brown
    "#5A5A5A", // Dark Gray
  ];

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/boards");
      setBoards(data);

      // Filter starred and recent boards
      setStarredBoards(data.filter((board) => board.isStarred));
      setRecentBoards(
        data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 4)
      );
    } catch (err) {
      setError("Failed to fetch boards");
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/boards", newBoardData);
      setBoards([...boards, data]);
      setShowCreateModal(false);
      setNewBoardData({
        title: "",
        description: "",
        background: "#2D4059",
      });
    } catch (err) {
      setError("Failed to create board");
      console.error("Error creating board:", err);
    }
  };

  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading boards...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Workspace</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Create Board
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Starred Boards Section */}
      {starredBoards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">
              Starred Boards
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {starredBoards.map((board) => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Boards Section */}
      {recentBoards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-gray-500" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Boards
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentBoards.map((board) => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        </div>
      )}

      {/* All Boards Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-gray-500" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">All Boards</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBoards.map((board) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Board</h3>
            <form onSubmit={handleCreateBoard}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Title
                </label>
                <input
                  type="text"
                  value={newBoardData.title}
                  onChange={(e) =>
                    setNewBoardData({ ...newBoardData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newBoardData.description}
                  onChange={(e) =>
                    setNewBoardData({
                      ...newBoardData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-md ${
                        newBoardData.background === color
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setNewBoardData({ ...newBoardData, background: color })
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// BoardCard Component
const BoardCard = ({ board }) => {
  return (
    <Link to={`/board/${board._id}`} className="block group">
      <div
        className="h-32 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        style={{ backgroundColor: board.background }}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <h3 className="text-white text-xl font-semibold mb-2">{board.title}</h3>
        {board.description && (
          <p className="text-white/80 text-sm line-clamp-2">
            {board.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default DashboardPage;
