import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { EditTaskDialog } from "../../components/dialogs";
import { usePageTitle } from "../../hooks/usePageTitle";

const ClientTaskDetail = () => {
  usePageTitle("My Task Details");

  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [assigningBid, setAssigningBid] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Fetch task details
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  // Check if user is authorized to view this task
  useEffect(() => {
    // console.log(task.client);
    if (task && user && task.client._id !== user.user._id) {
      navigate("/dashboard/client");
    }
  }, [task, user, navigate]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Fetch task details
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${taskId}`);
      setTask(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching task details:", err);
      setError("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  // Assign task to a bidder
  const handleAssignTask = async (bidId) => {
    try {
      setAssigningBid(bidId);
      await api.post(`/tasks/${taskId}/assign`, { bidId });
      await fetchTaskDetails(); // Refresh task details
      alert("Task assigned successfully!");
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task");
    } finally {
      setAssigningBid(null);
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    )
      return;

    try {
      setDeleteLoading(true);
      await api.delete(`/tasks/${taskId}`);
      navigate("/dashboard/client");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit task
  const handleEditTask = () => {
    setEditDialogOpen(true);
  };

  // Handle save edited task
  const handleSaveTask = async (updatedTask) => {
    try {
      console.log("Saving task:", updatedTask);

      const taskId = updatedTask.id || updatedTask._id || task._id;
      const response = await api.put(`/tasks/${taskId}`, updatedTask);

      // Refresh task details to get the latest data
      await fetchTaskDetails();

      console.log("Task updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700";
      case "medium":
        return "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700";
      case "low":
        return "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      case "assigned":
        return "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700";
      case "in-progress":
        return "bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700";
      case "completed":
        return "bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center ">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard/client")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 "
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Task Not Found
          </h2>
          <button
            onClick={() => navigate("/dashboard/client")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 w-full">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md w-full">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-95 border-b border-gray-200 dark:border-gray-700 w-full"></div>
          <div className="relative w-full">
            <div className="w-full px-6 py-4">
              <div className="flex justify-between items-center w-full">
                {/* Logo */}{" "}
                <Link
                  to="/dashboard/client"
                  className="flex items-center space-x-3"
                >
                  <div className="p-3 rounded-2xl bg-blue-600">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-black font-sans bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                      DO IT!
                    </h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Task Details
                    </span>
                  </div>
                </Link>
                {/* Right Section */}
                <div className="flex items-center space-x-4">
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="relative w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-md"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {isDark ? (
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative profile-dropdown">
                    <button
                      onClick={toggleProfileDropdown}
                      className="relative w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-md"
                    >
                      <svg
                        className="w-6 h-6 text-gray-700 dark:text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="w-full px-4 py-3 text-left flex items-center space-x-3"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-gray-700 dark:text-gray-300">
                                {user?.name || "Profile"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                View and edit profile
                              </div>
                            </div>
                          </Link>

                          <button
                            onClick={() => {
                              logout();
                              navigate("/login");
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left flex items-center space-x-3"
                          >
                            <svg
                              className="w-5 h-5 text-red-600 dark:text-red-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-red-600 dark:text-red-400">
                                Sign Out
                              </div>
                              <div className="text-xs text-red-500 dark:text-red-500">
                                Log out of your account
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="w-full">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard/client")}
              className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" />
              </svg>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Back to Dashboard
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-200 dark:bg-blue-700 rounded-full opacity-10"></div>

                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h1>
                  <div className="flex space-x-3 ">
                    <button
                      onClick={handleEditTask}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:scale-105 transition-transform duration-300 shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteTask}
                      disabled={deleteLoading}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-md disabled:opacity-50 hover:scale-105 transition-transform duration-300"
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusStyle(
                      task.status
                    )} shadow-sm`}
                  >
                    {task.status?.charAt(0).toUpperCase() +
                      task.status?.slice(1)}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getUrgencyStyle(
                      task.urgency
                    )} shadow-sm`}
                  >
                    {task.urgency?.charAt(0).toUpperCase() +
                      task.urgency?.slice(1)}{" "}
                    Priority
                  </span>
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                    Posted {formatDate(task.createdAt)}
                  </span>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {task.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border border-green-200 dark:border-green-700/50 rounded-2xl p-6">
                    <h3 className="font-bold text-green-800 dark:text-green-300 mb-3 text-lg">
                      Budget
                    </h3>
                    <p className="text-3xl font-black text-green-700 dark:text-green-400">
                      {formatCurrency(task.budget)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700/50 rounded-2xl p-6">
                    <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-3 text-lg">
                      Deadline
                    </h3>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                      {formatDate(task.deadline)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700/50 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 text-lg">
                      Category
                    </h3>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                      {task.category}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border border-orange-200 dark:border-orange-700/50 rounded-2xl p-6">
                    <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-3 text-lg">
                      Location
                    </h3>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-400">
                      {task.location || "Remote"}
                    </p>
                  </div>
                </div>

                {task.skillsRequired && task.skillsRequired.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {task.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-300 rounded-xl text-sm font-semibold border border-blue-200 dark:border-blue-700 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bids Section */}
            <div className="space-y-6">
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
                <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-200 dark:bg-indigo-700 rounded-full opacity-10"></div>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                  Bids ({task.bidders?.length || 0})
                </h2>

                {!task.bidders || task.bidders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      No bids yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Your task will attract providers soon!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {task.bidders.map((bid) => (
                      <div
                        key={bid._id}
                        className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/30 dark:to-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/50 dark:from-blue-900/10 dark:to-orange-900/10 opacity-0 pointer-events-none rounded-2xl"></div>

                        <div className="relative">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                  {bid.user?.name?.charAt(0) || "P"}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                  {bid.user?.name || "Provider"}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  Rating: {bid.user?.rating || "N/A"} ⭐
                                </p>
                              </div>
                            </div>
                            <span className="text-2xl font-black text-green-600 dark:text-green-400">
                              {formatCurrency(bid.bidAmount)}
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            {bid.proposal}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-500 font-medium">
                              {bid.estimatedDuration} •{" "}
                              {formatDate(bid.createdAt)}
                            </span>

                            {task.status === "open" && (
                              <button
                                onClick={() => handleAssignTask(bid._id)}
                                disabled={assigningBid === bid._id}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-md disabled:opacity-50"
                              >
                                {assigningBid === bid._id
                                  ? "Assigning..."
                                  : "Assign"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
        }}
        task={
          task
            ? {
                ...task,
                id: task._id,
                skills: task.skillsRequired || [],
              }
            : null
        }
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default ClientTaskDetail;
