import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { StatsSkeleton, TaskCardSkeleton } from "../../components/skeletons";
import { EditTaskDialog } from "../../components/dialogs";

const DashboardClient = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    inProgress: 0,
    completed: 0,
    totalSpent: 0,
    totalBids: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks/my-tasks");
      const rawTasks = response.data.tasks || [];

      // Map backend status to frontend status and ensure all required fields exist
      const mappedTasks = rawTasks.map((task) => ({
        ...task,
        status: mapTaskStatus(task.status),
        // Ensure all fields exist with defaults
        assignedTo: task.assignedTo || null,
        completedAt: task.completedAt || null,
        bids: task.bids || 0,
        priority: task.priority || "medium",
      }));

      console.log(response);

      setTasks(mappedTasks);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await api.get("/tasks/stats");
      if (response.data.client) {
        setStats({
          totalTasks: response.data.client.totalTasks,
          activeTasks: response.data.client.activeTasks,
          inProgress: response.data.client.inProgressTasks,
          completed: response.data.client.completedTasks,
          totalSpent: response.data.client.totalSpent,
          totalBids: response.data.client.totalBidsReceived,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Fetch data on component mount
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  // Close dropdown when clicking outside
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

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Handle edit task
  const handleEditTask = (task) => {
    console.log(task);
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  // Handle save edited task
  const handleSaveTask = async (updatedTask) => {
    try {
      console.log("Saving task:", updatedTask);

      // Make sure we're using the right ID format for the API call
      // Some APIs use _id and some use id
      const taskId = updatedTask.id || updatedTask._id;

      const response = await api.put(`/tasks/${taskId}`, updatedTask);

      // Get the updated task from the response
      const responseTask = response.data.task || response.data;

      // Update the task in the local state
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          // Check both id and _id to be safe
          if (
            (task.id && task.id === updatedTask.id) ||
            (task._id && task._id === updatedTask._id)
          ) {
            // Create a new task object with the original task's properties
            // and updated fields from the form
            return {
              ...task,
              title: updatedTask.title,
              description: updatedTask.description,
              category: updatedTask.category,
              budget: updatedTask.budget,
              deadline: updatedTask.deadline,
              urgency: updatedTask.urgency,
              skills: updatedTask.skillsRequired || updatedTask.skills,
            };
          }
          return task;
        });
      });

      // Log the server response for debugging
      console.log("Server response:", response.data);

      // If the server response doesn't have the expected format,
      // re-fetch all tasks to make sure we have the latest data
      const serverTask = response.data.task || response.data;
      if (!serverTask || (!serverTask.id && !serverTask._id)) {
        // Re-fetch all tasks to make sure we have the latest data
        fetchTasks();
      }

      // Refresh stats to reflect any changes
      fetchStats();
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  };

  // Map backend status to frontend status
  const mapTaskStatus = (backendStatus) => {
    const statusMap = {
      open: "active",
      pending: "active",
      assigned: "active",
      accepted: "active",
      "in-progress": "in_progress",
      completed: "completed",
      cancelled: "cancelled",
      rescheduled: "active",
    };
    return statusMap[backendStatus] || backendStatus;
  };

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "in_progress":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      case "pending_review":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "pending_review":
        return "Pending Review";
      default:
        return status;
    }
  };

  // Dashboard SVG Illustration
  const DashboardSVG = () => (
    <div className="undraw-container animate-fade-in-up">
      <svg viewBox="0 0 400 200" className="animate-float">
        {/* Background Elements */}
        <circle
          cx="350"
          cy="30"
          r="20"
          fill="#3b82f6"
          opacity="0.1"
          className="animate-pulse"
        />
        <circle
          cx="50"
          cy="170"
          r="15"
          fill="#fb923c"
          opacity="0.1"
          className="animate-pulse"
        />

        {/* Dashboard Screen */}
        <g className="animate-slide-in-left">
          <rect
            x="80"
            y="40"
            width="240"
            height="120"
            rx="12"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Header */}
          <rect
            x="90"
            y="50"
            width="220"
            height="20"
            rx="4"
            fill="#3b82f6"
            opacity="0.8"
          />
          <circle cx="300" cy="60" r="6" fill="#fb923c" />

          {/* Task Cards */}
          <rect
            x="100"
            y="80"
            width="60"
            height="30"
            rx="6"
            fill="#10b981"
            opacity="0.3"
          />
          <rect
            x="170"
            y="80"
            width="60"
            height="30"
            rx="6"
            fill="#fb923c"
            opacity="0.3"
          />
          <rect
            x="240"
            y="80"
            width="60"
            height="30"
            rx="6"
            fill="#3b82f6"
            opacity="0.3"
          />

          <rect x="100" y="120" width="200" height="8" rx="4" fill="#f3f4f6" />
          <rect x="100" y="135" width="150" height="6" rx="3" fill="#d1d5db" />
        </g>

        {/* Floating Analytics */}
        <g className="animate-slide-in-right">
          <circle cx="340" cy="100" r="25" fill="#10b981" opacity="0.2" />
          <path
            d="M 330 105 L 335 110 L 350 95"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Floating Elements */}
        <circle
          cx="70"
          cy="80"
          r="6"
          fill="#3b82f6"
          className="animate-float"
        />
        <circle
          cx="360"
          cy="160"
          r="4"
          fill="#fb923c"
          className="animate-float"
        />
        <rect
          x="60"
          y="140"
          width="8"
          height="8"
          rx="2"
          fill="#10b981"
          className="animate-float"
        />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen clean-bg transition-colors duration-500 dark:bg-primary-dark bg-primary w-full">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md w-full">
        <div className="relative w-full">
          <div className="absolute inset-0 dark:bg-primary-dark bg-primary opacity-[96%] w-full"></div>
          <div className="relative dark:bg-primary-dark bg-primary border-b border-solid dark:border-primary-border-dark border-primary-border w-full">
            <div className="w-full px-6 py-4">
              <div className="flex justify-between items-center w-full">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="p-3 rounded-2xl hover-lift transition-all duration-300 group-hover:scale-105 bg-primary-main dark:bg-primary-main-dark shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-black font-poppins dark:text-white text-black group-hover:scale-105 transition-transform duration-300">
                      DO IT!
                    </h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Client Dashboard
                    </span>
                  </div>
                </Link>

                {/* Navigation Items */}
                <div className="flex items-center space-x-4">
                  {/* Profile Dropdown */}
                  <div className="relative profile-dropdown">
                    <button
                      onClick={toggleProfileDropdown}
                      className="relative p-3 rounded-full hover-lift transition-all duration-300 bg-accent-bg border-2 border-solid dark:border-primary-border-dark border-primary-border shadow-lg hover:shadow-xl"
                    >
                      <svg
                        className="w-6 h-6 text-primary-main dark:text-primary-main-dark"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-secondary dark:bg-bg-secondary-dark rounded-xl shadow-2xl border border-primary-border dark:border-primary-border-dark z-50 overflow-hidden">
                        <div className="py-2">
                          {/* Profile Link */}
                          <Link
                            to="/profile"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
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
                              <div className="font-medium text-primary-text dark:text-primary">
                                My Profile
                              </div>
                              <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                                View and edit profile
                              </div>
                            </div>
                          </Link>

                          {/* Dark Mode Toggle */}
                          <button
                            onClick={() => {
                              toggleDarkMode();
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
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
                                  className="w-5 h-5 text-slate-700"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-primary-text dark:text-primary">
                                {isDark ? "Light Mode" : "Dark Mode"}
                              </div>
                              <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                                Switch to {isDark ? "light" : "dark"} theme
                              </div>
                            </div>
                          </button>

                          {/* Divider */}
                          <div className="border-t border-primary-border dark:border-primary-border-dark my-1"></div>

                          {/* Settings Link */}
                          {/* <Link
                            to="/settings"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 text-gray-600 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-primary-text dark:text-primary-text-dark">
                                Settings
                              </div>
                              <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                                App preferences
                              </div>
                            </div>
                          </Link> */}

                          {/* Logout */}
                          <button
                            onClick={() => {
                              // Add logout logic here
                              logout();
                              // Redirect to login or home page
                              navigate("/login");
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-3"
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
          {/* Header Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="animate-slide-in-left">
                <h1 className="text-4xl md:text-5xl font-black font-poppins mb-4 text-gradient-primary dark:text-primary-hover-dark">
                  Welcome Back!
                </h1>
                <p className="text-xl text-secondary-text dark:text-secondary-text-dark mb-6">
                  Manage your tasks and track progress from your dashboard
                </p>

                {/* Quick Action */}
                <Link
                  to="/post-task"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-primary-main dark:bg-primary-main-dark text-white rounded-xl hover-lift transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                  <span>Post New Task</span>
                </Link>
              </div>

              <div className="animate-slide-in-right">
                <DashboardSVG />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {loading ? (
              <StatsSkeleton count={6} />
            ) : (
              <>
                <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700/50 rounded-2xl p-6 text-center hover-lift transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="absolute top-2 right-2 w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-blue-700 dark:text-blue-300 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stats.totalTasks}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Total Tasks
                  </p>
                </div>

                <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border border-green-200 dark:border-green-700/50 rounded-2xl p-6 text-center hover-lift transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                  <div className="absolute top-2 right-2 w-8 h-8 bg-green-200 dark:bg-green-700 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-green-700 dark:text-green-300 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stats.activeTasks}
                  </h3>
                  <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Active Tasks
                  </p>
                </div>

                <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-orange-600 dark:text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-text dark:text-primary mb-2">
                    {stats.inProgress}
                  </h3>
                  <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    In Progress
                  </p>
                </div>

                <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold  text-primary-text dark:text-primary mb-2">
                    {stats.completed}
                  </h3>
                  <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Completed
                  </p>
                </div>

                <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-text dark:text-primary mb-2">
                    ${stats.totalSpent}
                  </h3>
                  <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Total Spent
                  </p>
                </div>

                <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-teal-600 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-text dark:text-primary mb-2">
                    {stats.totalBids}
                  </h3>
                  <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Total Bids
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Popular Categories Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-poppins text-primary-text dark:text-white mb-6">
              Popular Categories
            </h2>
            <p className="text-lg text-secondary-text dark:text-secondary-text-dark mb-6">
              Find skilled providers in these popular categories
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Link
                to="/providers/web-development"
                className="clean-card p-6 hover-lift transition-all duration-300 hover:shadow-lg group border border-primary-border dark:border-primary-border-dark hover:border-blue-200 dark:hover:border-blue-700 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,12L10,8L8.5,9.5L11,12L8.5,14.5L10,16L14,12M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,4V20H18V4H6Z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-text dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-2">
                  Web Development
                </h3>
                <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                  React, Node.js, PHP
                </p>
              </Link>

              <Link
                to="/providers/graphic-design"
                className="clean-card p-6 hover-lift transition-all duration-300 hover:shadow-lg group border border-primary-border dark:border-primary-border-dark hover:border-purple-200 dark:hover:border-purple-700 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-purple-600 dark:text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-text dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-2">
                  Graphic Design
                </h3>
                <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                  Logos, Branding, Print
                </p>
              </Link>

              <Link
                to="/providers/writing"
                className="clean-card p-6 hover-lift transition-all duration-300 hover:shadow-lg group border border-primary-border dark:border-primary-border-dark hover:border-green-200 dark:hover:border-green-700 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-text dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 mb-2">
                  Writing
                </h3>
                <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                  Content, Copywriting, SEO
                </p>
              </Link>

              <Link
                to="/providers/ui-ux-design"
                className="clean-card p-6 hover-lift transition-all duration-300 hover:shadow-lg group border border-primary-border dark:border-primary-border-dark hover:border-pink-200 dark:hover:border-pink-700 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-pink-600 dark:text-pink-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-text dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 mb-2">
                  UI/UX Design
                </h3>
                <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                  Mobile, Web, Prototyping
                </p>
              </Link>

              <Link
                to="/providers/data-science"
                className="clean-card p-6 hover-lift transition-all duration-300 hover:shadow-lg group border border-primary-border dark:border-primary-border-dark hover:border-indigo-200 dark:hover:border-indigo-700 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17M19.5,19.1H4.5V5H6.5V17.1H19.5V19.1Z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-text dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 mb-2">
                  Data Science
                </h3>
                <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                  Analytics, ML, Python
                </p>
              </Link>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-poppins text-primary-text dark:text-white">
                Your Tasks
              </h2>
              <div className="flex space-x-3">
                <select className="px-4 py-2 rounded-xl border border-primary-border dark:border-primary-border-dark bg-secondary dark:bg-gray-800 dark:text-white text-primary-text dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="pending_review">Pending Review</option>
                </select>
                <select className="px-4 py-2 rounded-xl border border-primary-border dark:border-primary-border-dark bg-secondary dark:bg-gray-800 dark:text-white text-primary-text dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Categories</option>
                  <option value="web_development">Web Development</option>
                  <option value="graphic_design">Graphic Design</option>
                  <option value="writing">Writing</option>
                  <option value="ui_ux">UI/UX Design</option>
                  <option value="data_science">Data Science</option>
                </select>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <TaskCardSkeleton count={6} />
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="clean-card p-6 hover-lift transition-all duration-300 border border-primary-border dark:border-primary-border-dark hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg group relative overflow-hidden"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/50 dark:from-blue-900/10 dark:to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    {/* Task Header */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3 mb-3">
                          {/* Category Icon */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            {task.category === "Web Development" && (
                              <svg
                                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M14,12L10,8L8.5,9.5L11,12L8.5,14.5L10,16L14,12M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,4V20H18V4H6Z" />
                              </svg>
                            )}
                            {task.category === "Graphic Design" && (
                              <svg
                                className="w-5 h-5 text-purple-600 dark:text-purple-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18C13.24,18 14.4,17.69 15.41,17.14L13.88,15.61C13.29,15.85 12.66,16 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12C16,12.66 15.85,13.29 15.61,13.88L17.14,15.41C17.69,14.4 18,13.24 18,12A6,6 0 0,0 12,6Z" />
                              </svg>
                            )}
                            {task.category === "Writing" && (
                              <svg
                                className="w-5 h-5 text-green-600 dark:text-green-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                            )}
                            {task.category === "UI/UX Design" && (
                              <svg
                                className="w-5 h-5 text-pink-600 dark:text-pink-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z" />
                              </svg>
                            )}
                            {task.category === "Data Science" && (
                              <svg
                                className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17M19.5,19.1H4.5V5H6.5V17.1H19.5V19.1Z" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-primary-text dark:text-primary-text-dark mb-2 line-clamp-2 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors duration-300">
                              {task.title}
                            </h3>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusStyle(
                            task.status
                          )}`}
                        >
                          {formatStatus(task.status)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* Task Description */}
                    <p className="text-secondary-text dark:text-gray-400 mb-4 line-clamp-3 relative z-10 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Task Stats */}
                    <div className="space-y-2 mb-4 relative z-10">
                      <div className="flex justify-between items-center py-1">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
                          </svg>
                          <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                            Budget:
                          </span>
                        </div>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${task.budget.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                          </svg>
                          <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                            Bids:
                          </span>
                        </div>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {task.bids}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-orange-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                          </svg>
                          <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                            Deadline:
                          </span>
                        </div>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      {task.assignedTo && (
                        <div className="flex justify-between items-center py-1">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-purple-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                            <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                              Assigned to:
                            </span>
                          </div>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {task.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Task Actions */}
                    <div className="flex space-x-2 relative z-10">
                      <button 
                        onClick={() => navigate(`/tasks/${task._id || task.id}/client`)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        View Details
                      </button>
                      {task.status === "active" && (
                        <button
                          onClick={() => handleEditTask(task)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Edit
                        </button>
                      )}
                      {task.status === "pending_review" && (
                        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Empty State (if no tasks) */}
          {!loading && !error && tasks.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-4">
                No tasks posted yet
              </h3>
              <p className="text-secondary-text dark:text-secondary-text-dark mb-8">
                Start by posting your first task and get things done!
              </p>
              <Link
                to="/post-task"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-primary-main dark:bg-primary-main-dark text-white rounded-xl hover-lift transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                </svg>
                <span>Post Your First Task</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default DashboardClient;
