import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

const ViewTaskDetail = () => {
  usePageTitle("Task Details");

  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

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

  // Dummy task data (in real app, fetch based on taskId)
  const taskData = {
    id: taskId || 1,
    title: "E-commerce Website Development",
    description: "Build a modern e-commerce platform with payment integration and inventory management. The website should include user authentication, product catalog, shopping cart, order management, and admin dashboard. Must be responsive and optimized for mobile devices.",
    category: "Web Development",
    budget: 2500,
    deadline: "2025-08-15",
    location: "40.712776, -74.005974",
    skillsRequired: ["React", "Node.js", "MongoDB", "Payment Integration", "Responsive Design"],
    urgency: "high",
    clientName: "TechStore Inc.",
    clientRating: 4.8,
    clientReviews: 47,
    postedAt: "2025-06-18",
    applicants: 8,
    status: "open",
    clientId: "client123",
    clientJoinDate: "2024-03-15",
    clientCompletedProjects: 23,
    estimatedDuration: "6-8 weeks",
    paymentType: "Fixed Price",
    experienceLevel: "Intermediate to Expert"
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700";
      case "medium":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const handleApply = () => {
    setIsApplied(true);
    // TODO: Send application to backend
    console.log("Applied to task:", taskId);
  };

  // Task Detail SVG Illustration
  const TaskDetailSVG = () => (
    <div className="undraw-container animate-fade-in-up">
      <svg viewBox="0 0 400 300" className="animate-float">
        {/* Background Elements */}
        <circle
          cx="350"
          cy="50"
          r="30"
          fill="#3b82f6"
          opacity="0.1"
          className="animate-pulse"
        />
        <circle
          cx="50"
          cy="250"
          r="20"
          fill="#fb923c"
          opacity="0.1"
          className="animate-pulse"
        />
        {/* Task Document */}
        <g className="animate-slide-in-left">
          <rect
            x="120"
            y="60"
            width="180"
            height="220"
            rx="12"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <rect x="140" y="80" width="140" height="15" rx="4" fill="#3b82f6" />
          <rect x="140" y="105" width="100" height="8" rx="4" fill="#fb923c" />
          <rect x="140" y="125" width="120" height="6" rx="3" fill="#e2e8f0" />
          <rect x="140" y="140" width="110" height="6" rx="3" fill="#e2e8f0" />
          <rect x="140" y="155" width="90" height="6" rx="3" fill="#e2e8f0" />
          <rect x="140" y="180" width="60" height="20" rx="10" fill="#10b981" />
          <rect x="210" y="180" width="60" height="20" rx="10" fill="#f59e0b" />
          <rect x="140" y="220" width="140" height="25" rx="12" fill="#3b82f6" />
        </g>
        {/* Person Character */}
        <g className="animate-slide-in-right">
          <circle cx="320" cy="160" r="20" fill="#fbbf24" />
          <rect x="310" y="180" width="20" height="30" rx="10" fill="#3b82f6" />
          <circle cx="315" cy="155" r="2" fill="#1f2937" />
          <circle cx="325" cy="155" r="2" fill="#1f2937" />
          <path
            d="M315 165 Q320 170 325 165"
            stroke="#1f2937"
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );

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
                  {/* Back Button */}
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Back</span>
                  </button>

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

                          {/* Dashboard Link */}
                          <Link
                            to="/dashboard-provider"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-primary-text dark:text-primary">
                                Dashboard
                              </div>
                              <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                                View tasks
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
                              console.log("Logout clicked");
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

      {/* Header Section */}
      <section className="px-4 py-8 min-h-fit flex items-center dark:bg-primary-dark bg-primary ">
        <div className="max-w-7xl mx-auto w-full ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[40vh]">
            <div className="animate-slide-in-left flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyStyle(taskData.urgency)}`}>
                  {taskData.urgency} priority
                </span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700">
                  {taskData.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black font-poppins mb-4 leading-tight dark:text-primary-hover text-primary-hover-dark">
                {taskData.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6 text-secondary-text dark:text-secondary-text-dark">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-lg">${taskData.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Due {new Date(taskData.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  <span>{taskData.applicants} applicants</span>
                </div>
              </div>
              <p className="text-lg font-medium leading-relaxed max-w-2xl text-secondary-text">
                Posted by {taskData.clientName} • {new Date(taskData.postedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="animate-slide-in-right flex items-center justify-center">
              <TaskDetailSVG />
            </div>
          </div>
        </div>
      </section>

      {/* Task Details Content */}
      <div className="w-full px-6 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Task Description */}
              <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-primary-text dark:text-primary">
                  Task Description
                </h2>
                <div className="prose prose-lg max-w-none text-secondary-text dark:text-secondary-text-dark leading-relaxed">
                  <p>{taskData.description}</p>
                </div>
              </div>

              {/* Skills Required */}
              <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-primary-text dark:text-primary">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-3">
                  {taskData.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Task Details Grid */}
              <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-primary-text dark:text-primary">
                  Project Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-text dark:text-secondary-text-dark mb-1">
                        Duration
                      </label>
                      <div className="text-lg font-semibold text-primary-text dark:text-primary">
                        {taskData.estimatedDuration}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-text dark:text-secondary-text-dark mb-1">
                        Payment Type
                      </label>
                      <div className="text-lg font-semibold text-primary-text dark:text-primary">
                        {taskData.paymentType}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-text dark:text-secondary-text-dark mb-1">
                        Experience Level
                      </label>
                      <div className="text-lg font-semibold text-primary-text dark:text-primary">
                        {taskData.experienceLevel}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-text dark:text-secondary-text-dark mb-1">
                        Location
                      </label>
                      <div className="text-lg font-semibold text-primary-text dark:text-primary">
                        {taskData.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Apply Card */}
                <div className="clean-card p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-primary-border dark:border-primary-border-dark shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-black text-green-600 dark:text-green-400 mb-2">
                      ${taskData.budget.toLocaleString()}
                    </div>
                    <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                      {taskData.paymentType}
                    </div>
                  </div>

                  <button
                    onClick={handleApply}
                    disabled={isApplied}
                    className={`w-full px-6 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 ${
                      isApplied
                        ? "bg-green-600 text-white cursor-not-allowed"
                        : "btn-primary bg-primary-main text-white hover-lift"
                    }`}
                  >
                    {isApplied ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Applied Successfully</span>
                      </div>
                    ) : (
                      "Apply for this Task"
                    )}
                  </button>

                  <div className="mt-4 text-center text-sm text-secondary-text dark:text-secondary-text-dark">
                    {taskData.applicants} {taskData.applicants === 1 ? 'person has' : 'people have'} applied
                  </div>
                </div>

                {/* Client Info Card */}
                <div className="clean-card p-6 border border-primary-border dark:border-primary-border-dark shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-primary-text dark:text-primary">
                    About the Client
                  </h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {taskData.clientName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-text dark:text-primary">
                        {taskData.clientName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                          {taskData.clientRating} ({taskData.clientReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-text dark:text-secondary-text-dark">Member since:</span>
                      <span className="font-medium text-primary-text dark:text-primary">
                        {new Date(taskData.clientJoinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text dark:text-secondary-text-dark">Projects completed:</span>
                      <span className="font-medium text-primary-text dark:text-primary">
                        {taskData.clientCompletedProjects}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskDetail;