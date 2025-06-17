import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DashboardClient = () => {
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Dummy data for tasks
  const dummyTasks = [
    {
      id: 1,
      title: "Website Design for Coffee Shop",
      description: "Need a modern, responsive website for my coffee shop with online ordering functionality.",
      category: "Web Development",
      budget: 1200,
      status: "active",
      deadline: "2025-07-15",
      bids: 12,
      createdAt: "2025-06-10",
      priority: "high"
    },
    {
      id: 2,
      title: "Logo Design for Tech Startup",
      description: "Looking for a creative logo that represents innovation and technology.",
      category: "Graphic Design",
      budget: 500,
      status: "in_progress",
      deadline: "2025-06-25",
      bids: 8,
      createdAt: "2025-06-05",
      priority: "medium",
      assignedTo: "Sarah Wilson"
    },
    {
      id: 3,
      title: "Content Writing for Blog",
      description: "Need 10 SEO-optimized blog posts about digital marketing trends.",
      category: "Writing",
      budget: 800,
      status: "completed",
      deadline: "2025-06-20",
      bids: 15,
      createdAt: "2025-05-28",
      priority: "low",
      assignedTo: "Mike Johnson",
      completedAt: "2025-06-18"
    },
    {
      id: 4,
      title: "Mobile App UI/UX Design",
      description: "Design modern and intuitive interface for a fitness tracking mobile application.",
      category: "UI/UX Design",
      budget: 2000,
      status: "active",
      deadline: "2025-08-01",
      bids: 6,
      createdAt: "2025-06-15",
      priority: "high"
    },
    {
      id: 5,
      title: "Data Analysis Project",
      description: "Analyze customer data and provide insights for business improvement.",
      category: "Data Science",
      budget: 1500,
      status: "pending_review",
      deadline: "2025-07-10",
      bids: 4,
      createdAt: "2025-06-12",
      priority: "medium",
      assignedTo: "Alex Chen"
    }
  ];

  // Statistics
  const stats = {
    totalTasks: dummyTasks.length,
    activeTasks: dummyTasks.filter(task => task.status === 'active').length,
    inProgress: dummyTasks.filter(task => task.status === 'in_progress').length,
    completed: dummyTasks.filter(task => task.status === 'completed').length,
    totalSpent: dummyTasks.filter(task => task.status === 'completed').reduce((sum, task) => sum + task.budget, 0),
    totalBids: dummyTasks.reduce((sum, task) => sum + task.bids, 0)
  };

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'in_progress':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'pending_review':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'pending_review': return 'Pending Review';
      default: return status;
    }
  };

  // Dashboard SVG Illustration
  const DashboardSVG = () => (
    <div className="undraw-container animate-fade-in-up">
      <svg viewBox="0 0 400 200" className="animate-float">
        {/* Background Elements */}
        <circle cx="350" cy="30" r="20" fill="#3b82f6" opacity="0.1" className="animate-pulse" />
        <circle cx="50" cy="170" r="15" fill="#fb923c" opacity="0.1" className="animate-pulse" />
        
        {/* Dashboard Screen */}
        <g className="animate-slide-in-left">
          <rect x="80" y="40" width="240" height="120" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
          
          {/* Header */}
          <rect x="90" y="50" width="220" height="20" rx="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="300" cy="60" r="6" fill="#fb923c" />
          
          {/* Task Cards */}
          <rect x="100" y="80" width="60" height="30" rx="6" fill="#10b981" opacity="0.3" />
          <rect x="170" y="80" width="60" height="30" rx="6" fill="#fb923c" opacity="0.3" />
          <rect x="240" y="80" width="60" height="30" rx="6" fill="#3b82f6" opacity="0.3" />
          
          <rect x="100" y="120" width="200" height="8" rx="4" fill="#f3f4f6" />
          <rect x="100" y="135" width="150" height="6" rx="3" fill="#d1d5db" />
        </g>
        
        {/* Floating Analytics */}
        <g className="animate-slide-in-right">
          <circle cx="340" cy="100" r="25" fill="#10b981" opacity="0.2" />
          <path d="M 330 105 L 335 110 L 350 95" stroke="#10b981" strokeWidth="2" fill="none" />
        </g>
        
        {/* Floating Elements */}
        <circle cx="70" cy="80" r="6" fill="#3b82f6" className="animate-float" />
        <circle cx="360" cy="160" r="4" fill="#fb923c" className="animate-float" />
        <rect x="60" y="140" width="8" height="8" rx="2" fill="#10b981" className="animate-float" />
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
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-black font-poppins text-gradient-primary group-hover:scale-105 transition-transform duration-300">
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
                              <div className="font-medium text-primary-text dark:text-primary-text-dark">
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
                              <div className="font-medium text-primary-text dark:text-primary-text-dark">
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
                          <Link
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
                          </Link>

                          {/* Logout */}
                          <button
                            onClick={() => {
                              // Add logout logic here
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

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="w-full max-w-7xl mx-auto">
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
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
            <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-2">{stats.totalTasks}</h3>
              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">Total Tasks</p>
            </div>

            <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-2">{stats.activeTasks}</h3>
              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">Active Tasks</p>
            </div>

            <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-2">{stats.inProgress}</h3>
              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">In Progress</p>
            </div>

            <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-2">{stats.completed}</h3>
              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">Completed</p>
            </div>

            <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-2">${stats.totalSpent}</h3>
              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">Total Spent</p>
            </div>

            <div className="clean-card p-6 text-center hover-lift transition-all duration-300">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-2">{stats.totalBids}</h3>
              <p className="text-sm text-secondary-text dark:text-secondary-text-dark">Total Bids</p>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold font-poppins text-primary-text dark:text-primary-text-dark">
                Your Tasks
              </h2>
              <div className="flex space-x-3">
                <select className="px-4 py-2 rounded-xl border border-primary-border dark:border-primary-border-dark bg-secondary dark:bg-bg-secondary-dark text-primary-text dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="pending_review">Pending Review</option>
                </select>
                <select className="px-4 py-2 rounded-xl border border-primary-border dark:border-primary-border-dark bg-secondary dark:bg-bg-secondary-dark text-primary-text dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              {dummyTasks.map((task) => (
                <div key={task.id} className="clean-card p-6 hover-lift transition-all duration-300">
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-text dark:text-primary-text-dark mb-2 line-clamp-2">
                        {task.title}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {task.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(task.status)}`}>
                        {formatStatus(task.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  {/* Task Description */}
                  <p className="text-secondary-text dark:text-secondary-text-dark mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  {/* Task Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-text dark:text-secondary-text-dark">Budget:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">${task.budget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-text dark:text-secondary-text-dark">Bids:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{task.bids}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-text dark:text-secondary-text-dark">Deadline:</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    {task.assignedTo && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-text dark:text-secondary-text-dark">Assigned to:</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">{task.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  {/* Task Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-primary-main dark:bg-primary-main-dark text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm font-medium">
                      View Details
                    </button>
                    {task.status === 'active' && (
                      <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 text-sm font-medium">
                        Edit
                      </button>
                    )}
                    {task.status === 'pending_review' && (
                      <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 text-sm font-medium">
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State (if no tasks) */}
          {dummyTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                </svg>
                <span>Post Your First Task</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
