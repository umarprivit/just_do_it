import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { usePageTitle } from "../../hooks/usePageTitle";

const DashboardProvider = () => {
  usePageTitle("Provider Dashboard");

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [appliedTaskIds, setAppliedTaskIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedProjects: 0,
    availableTasks: 0,
    averageRating: 0,
  });

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

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      const allTasks =
        response.data.tasks || response.data.data || response.data || [];

      // Filter tasks based on provider's perspective
      const availableTasks = allTasks.filter(
        (task) =>
          task.status === "open" &&
          (task.client?._id || task.client?.id || task.client) !== user._id
      );

      const providerTasks = allTasks.filter(
        (task) =>
          (task.assignedTo?._id || task.assignedTo?.id || task.assignedTo) ===
          user._id
      );

      const providerCompletedTasks = providerTasks.filter(
        (task) => task.status === "completed"
      );

      setTasks(availableTasks);
      setMyTasks(providerTasks);
      setCompletedTasks(providerCompletedTasks);

      // Calculate stats
      const totalEarnings = providerCompletedTasks.reduce(
        (sum, task) => sum + (task.budget || 0),
        0
      );
      const completedProjects = providerCompletedTasks.length;

      // Get average rating from reviews
      let averageRating = 0;
      try {
        const reviewsResponse = await api.get(`/reviews/${user._id}`);
        const reviews = reviewsResponse.data || [];
        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          averageRating = (totalRating / reviews.length).toFixed(1);
        }
      } catch (reviewError) {
        console.error("Error fetching reviews:", reviewError);
      }

      setStats({
        totalEarnings,
        completedProjects,
        availableTasks: availableTasks.length,
        averageRating,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle applying to a task
  const handleApplyToTask = async (taskId) => {
    try {
      // Apply to task instantly - just add to bidders list
      console.log("Applying to task:", taskId);
      await api.post(`/tasks/${taskId}/bid`);

      setAppliedTaskIds((prev) => [...prev, taskId]);
      // Refresh tasks to get updated bid count
      await fetchTasks();
    } catch (error) {
      console.error("Error applying to task:", error);
      // If the API call fails, still show as applied for better UX
      setAppliedTaskIds((prev) => [...prev, taskId]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "medium":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };

  // Handle one-click apply
  // const handleApply = (taskId) => {
  //   if (!appliedTaskIds.includes(taskId)) {
  //     setAppliedTaskIds([...appliedTaskIds, taskId]);
  //   }
  // };

  return (
    <div className="min-h-screen clean-bg transition-colors duration-500 dark:bg-primary-dark bg-primary w-full">
      {/* Loading Screen */}
      {loading ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching your tasks and statistics...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <nav className="sticky top-0 z-50 backdrop-blur-md w-full">
            <div className="relative w-full">
              <div className="absolute inset-0 dark:bg-primary-dark bg-primary opacity-95 border-b-primary-border dark:border-b-primary-border-dark w-full"></div>
              <div className="relative w-full">
                <div className="w-full px-6 py-4">
                  <div className="flex justify-between items-center w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                      <div className="p-3 rounded-2xl hover-lift transition-all duration-300 group-hover:scale-105 bg-primary-main">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text-2xl dark:text-primary font-black font-poppins text-gradient-primary group-hover:scale-105 transition-transform duration-300 ">
                          DO IT!
                        </h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Task Platform
                        </span>
                      </div>
                    </Link>
                    {/* Navigation Items */}
                    <div className="flex items-center space-x-4">
                      {/* Profile Dropdown */}
                      <div className="relative profile-dropdown">
                        <button
                          onClick={toggleProfileDropdown}
                          className="relative p-3 rounded-full hover-lift transition-all duration-300 bg-blue-400 border-2 border-solid dark:border-primary-border-dark border-primary-border shadow-lg hover:shadow-xl"
                        >
                          <svg
                            className="w-6 h-6 text-primary"
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
                                      className="w-5 h-5 text-yellow-300"
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

                              {/* Sign Out */}
                              <button
                                onClick={() => {
                                  // Add logout logic here
                                  logout();
                                  // Redirect to login or home page
                                  navigate("/login");
                                  // Close dropdown
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
          {/* Task Suggestion Card */}
          <div className="w-full px-6 pt-8">
            <div className="w-full max-w-4xl mx-auto mb-8">
              {tasks.length > 0 ? (
                <div className="clean-card p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-primary-border dark:border-primary-border-dark shadow-lg flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-20 h-20 md:w-24 md:h-24"
                      viewBox="0 0 64 64"
                      fill="none"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="32"
                        fill="#fb923c"
                        fillOpacity="0.12"
                      />
                      <path
                        d="M24 32h16M32 24v16"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <rect
                        x="28"
                        y="28"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#3b82f6"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-primary-text dark:text-primary">
                      Task Suggestion for You
                    </h2>
                    <div className="mb-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
                      {tasks[0].title}
                    </div>
                    <div className="mb-2 text-secondary-text dark:text-secondary-text-dark">
                      {tasks[0].description}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(tasks[0].skillsRequired || []).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      className={`px-5 py-2 btn-primary rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-primary-main ${
                        appliedTaskIds.includes(tasks[0]._id)
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={appliedTaskIds.includes(tasks[0].id)}
                      onClick={() => handleApplyToTask(tasks[0].id)}
                    >
                      {appliedTaskIds.includes(tasks[0]._id)
                        ? "Applied"
                        : "Apply Instantly"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="clean-card p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border border-primary-border dark:border-primary-border-dark shadow-lg text-center">
                  <h2 className="text-2xl font-bold mb-2 text-primary-text dark:text-primary">
                    No Available Tasks Yet
                  </h2>
                  <p className="text-secondary-text dark:text-secondary-text-dark">
                    Check back soon for new opportunities!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="w-full px-6 py-4">
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="clean-card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    ${stats.totalEarnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Total Earnings
                  </div>
                </div>
                <div className="clean-card p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stats.completedProjects}
                  </div>
                  <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Completed Projects
                  </div>
                </div>
                <div className="clean-card p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {stats.availableTasks}
                  </div>
                  <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Available Tasks
                  </div>
                </div>
                <div className="clean-card p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                    {stats.averageRating || 0}★
                  </div>
                  <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                    Average Rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards Replacement: Quick Tips */}
          <div className="w-full px-6 py-8">
            <div className="w-full max-w-4xl mx-auto mb-8">
              <div className="clean-card p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-primary-border dark:border-primary-border-dark shadow-lg flex flex-col md:flex-row items-center gap-6 animate-fade-in-up">
                <div className="flex-shrink-0">
                  <svg
                    className="w-20 h-20 md:w-24 md:h-24"
                    viewBox="0 0 64 64"
                    fill="none"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="32"
                      fill="#3b82f6"
                      fillOpacity="0.12"
                    />
                    <path
                      d="M32 16v20"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="32" cy="44" r="2.5" fill="#fb923c" />
                    <rect
                      x="28"
                      y="36"
                      width="8"
                      height="4"
                      rx="2"
                      fill="#fb923c"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-primary-text dark:text-primary">
                    Quick Tips for Providers
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 text-secondary-text dark:text-secondary-text-dark text-base">
                    <li>Apply quickly to new tasks for better chances.</li>
                    <li>
                      Keep your profile updated and showcase your best skills.
                    </li>
                    <li>Communicate clearly and promptly with clients.</li>
                    <li>
                      Deliver quality work to earn great reviews and more tasks.
                    </li>
                    <li>Check back often for new opportunities!</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Tab Navigation and Task Lists */}
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("available")}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "available"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  Available Tasks
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "completed"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Available Tasks Tab */}
            {activeTab === "available" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="clean-card p-6 transition-all duration-300 border border-primary-border dark:border-primary-border-dark shadow-lg group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/50 dark:from-blue-900/10 dark:to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-primary-text dark:text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {task.title}
                              </h3>
                              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
                                by {task.client?.name || "Client"}
                              </p>
                            </div>
                          </div>
                          <p className="text-secondary-text dark:text-secondary-text-dark mb-4 leading-relaxed">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                            {task.category}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyStyle(
                              task.urgency
                            )}`}
                          >
                            {task.urgency?.charAt(0).toUpperCase() +
                              task.urgency?.slice(1)}{" "}
                            Priority
                          </span>
                        </div>

                        {task.skillsRequired &&
                          task.skillsRequired.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-primary-text dark:text-primary mb-2">
                                Required Skills:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {task.skillsRequired.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-secondary-text dark:text-secondary-text-dark">
                              Budget:
                            </span>
                            <p className="font-bold text-green-600 dark:text-green-400">
                              ${task.budget?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-secondary-text dark:text-secondary-text-dark">
                              Deadline:
                            </span>
                            <p className="font-bold text-primary-text dark:text-primary">
                              {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-secondary-text dark:text-secondary-text-dark">
                              Location:
                            </span>
                            <p className="font-bold text-primary-text dark:text-primary">
                              {task.location || "Remote"}
                            </p>
                          </div>
                          <div>
                            <span className="text-secondary-text dark:text-secondary-text-dark">
                              Applicants:
                            </span>
                            <p className="font-bold text-blue-600 dark:text-blue-400">
                              {task.bidders?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                          Posted {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApplyToTask(task.id)}
                            disabled={appliedTaskIds.includes(task.id)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                              appliedTaskIds.includes(task._id)
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "bg-primary-main text-white shadow-md hover:shadow-lg"
                            }`}
                          >
                            {appliedTaskIds.includes(task._id)
                              ? "Applied"
                              : "Apply Now"}
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/tasks/${task._id}/provider`)
                            }
                            className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No Available Tasks
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Check back later for new opportunities!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Tab */}
            {activeTab === "completed" && (
              <div className="space-y-6">
                {completedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="clean-card p-6 transition-all duration-300 border border-green-200 dark:border-green-700 shadow-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-primary-text dark:text-primary-text-dark">
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          </div>
                        </div>
                        <p className="text-secondary-text dark:text-secondary-text-dark mb-3">
                          by {task.client?.name || "Client"}
                        </p>
                        <p className="text-secondary-text dark:text-secondary-text-dark leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${task.budget?.toLocaleString()}
                        </div>
                        <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                          Earned
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-secondary-text dark:text-secondary-text-dark">
                          Category:
                        </span>
                        <p className="font-bold text-primary-text dark:text-primary">
                          {task.category}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-text dark:text-secondary-text-dark">
                          Completed:
                        </span>
                        <p className="font-bold text-primary-text dark:text-primary">
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-text dark:text-secondary-text-dark">
                          Duration:
                        </span>
                        <p className="font-bold text-primary-text dark:text-primary">
                          {Math.ceil(
                            (new Date(task.updatedAt) -
                              new Date(task.createdAt)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </p>
                      </div>
                      <div>
                        <span className="text-secondary-text dark:text-secondary-text-dark">
                          Status:
                        </span>
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {task.status?.charAt(0).toUpperCase() +
                            task.status?.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {completedTasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No Completed Tasks Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Complete your first task to see it here!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardProvider;
