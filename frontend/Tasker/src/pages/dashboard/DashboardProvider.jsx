import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const DashboardProvider = () => {
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

  // Dummy data for available tasks
  const availableTasks = [
    {
      id: 1,
      title: "E-commerce Website Development",
      description:
        "Build a modern e-commerce platform with payment integration and inventory management.",
      category: "Web Development",
      budget: 2500,
      deadline: "2025-08-15",
      location: "Remote",
      skillsRequired: ["React", "Node.js", "MongoDB"],
      clientRating: 4.8,
      clientName: "TechStore Inc.",
      postedAt: "2025-06-18",
      applicants: 8,
      urgency: "high",
    },
    {
      id: 2,
      title: "Mobile App UI Design",
      description:
        "Design a clean and intuitive interface for a fitness tracking mobile application.",
      category: "UI/UX Design",
      budget: 1200,
      deadline: "2025-07-20",
      location: "Remote",
      skillsRequired: ["Figma", "Mobile Design", "Prototyping"],
      clientRating: 4.9,
      clientName: "FitLife Apps",
      postedAt: "2025-06-17",
      applicants: 12,
      urgency: "medium",
    },
    {
      id: 3,
      title: "Content Writing for Tech Blog",
      description:
        "Write 20 SEO-optimized articles about emerging technologies and digital trends.",
      category: "Writing",
      budget: 800,
      deadline: "2025-07-10",
      location: "Remote",
      skillsRequired: ["Technical Writing", "SEO", "Research"],
      clientRating: 4.7,
      clientName: "Digital Insights",
      postedAt: "2025-06-16",
      applicants: 15,
      urgency: "low",
    },
  ];

  // Dummy data for completed tasks
  const completedTasks = [
    {
      id: 6,
      title: "Data Analysis Dashboard",
      description:
        "Built interactive dashboard for sales data visualization and reporting.",
      category: "Data Science",
      budget: 1800,
      completedAt: "2025-06-10",
      clientRating: 5,
      clientFeedback: "Outstanding work! Delivered exactly what we needed.",
      clientName: "Analytics Corp",
      earnings: 1800,
    },
  ];

  // Statistics for provider
  const stats = {
    totalEarnings: completedTasks.reduce((sum, task) => sum + task.earnings, 0),
    completedProjects: completedTasks.length,
    availableTasks: availableTasks.length,
    averageRating:
      completedTasks.length > 0
        ? (
            completedTasks.reduce((sum, task) => sum + task.clientRating, 0) /
            completedTasks.length
          ).toFixed(1)
        : 0,
  };

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
  const handleApply = (taskId) => {
    if (!appliedTaskIds.includes(taskId)) {
      setAppliedTaskIds([...appliedTaskIds, taskId]);
    }
  };

  return (
    <div className="min-h-screen clean-bg transition-colors duration-500 dark:bg-primary-dark bg-primary w-full">
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
                {availableTasks[0].title}
              </div>
              <div className="mb-2 text-secondary-text dark:text-secondary-text-dark">
                {availableTasks[0].description}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableTasks[0].skillsRequired.map((skill, idx) => (
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
                  appliedTaskIds.includes(availableTasks[0].id)
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
                disabled={appliedTaskIds.includes(availableTasks[0].id)}
                onClick={() => handleApply(availableTasks[0].id)}
              >
                {appliedTaskIds.includes(availableTasks[0].id)
                  ? "Applied"
                  : "Apply Instantly"}
              </button>
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
            {availableTasks.map((task) => (
              <div
                key={task.id}
                className="clean-card p-6 hover-lift transition-all duration-300 border border-primary-border dark:border-primary-border-dark hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg group relative overflow-hidden"
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
                            <path d="M14,12L10,8L8.5,9.5L11,12L8.5,14.5L10,16L14,12M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,4V20H18V4H6Z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-primary-text dark:text-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-secondary dark:text-secondary-text-dark">
                            <span>by {task.clientName}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <span>⭐ {task.clientRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyStyle(
                          task.urgency
                        )}`}
                      >
                        {task.urgency} priority
                      </span>
                      <span className="text-xs text-secondary-text dark:text-secondary-text-dark">
                        {task.applicants} applicants
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary-text dark:text-secondary-text-dark mb-4 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {task.skillsRequired.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
                      </svg>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${task.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,1 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                      </svg>
                      <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                        Due {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className={`flex-1 px-4 py-2 btn-primary text-lg hover-lift flex items-center justify-center space-x-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl bg-primary-main text-white font-semibold ${
                        appliedTaskIds.includes(task.id)
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={appliedTaskIds.includes(task.id)}
                      onClick={() => handleApply(task.id)}
                    >
                      {appliedTaskIds.includes(task.id)
                        ? "Applied"
                        : "Apply Instantly"}
                    </button>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tab */}
        {activeTab === "completed" && (
          <div className="space-y-6">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="clean-card p-6 hover-lift transition-all duration-300 border border-green-200 dark:border-green-700 hover:shadow-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-primary-text dark:text-primary-text-dark">
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(task.clientRating)].map((_, index) => (
                          <svg
                            key={index}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                          </svg>
                        ))}
                        <span className="text-sm text-secondary-text dark:text-secondary-text-dark ml-1">
                          ({task.clientRating}/5)
                        </span>
                      </div>
                    </div>
                    <p className="text-secondary-text dark:text-secondary-text-dark mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-secondary-text dark:text-secondary-text-dark">
                      <span>Client: {task.clientName}</span>
                      <span>•</span>
                      <span>
                        Completed:{" "}
                        {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      ${task.earnings.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Earned
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Client Feedback:
                  </h4>
                  <p className="text-green-700 dark:text-green-400 text-sm italic">
                    "{task.clientFeedback}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProvider;
