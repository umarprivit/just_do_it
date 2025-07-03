import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { usePageTitle } from "../../hooks/usePageTitle";

const ProviderTaskDetail = () => {
  usePageTitle("Task Application");

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
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [bidData, setBidData] = useState({
    bidAmount: '',
    proposal: '',
    estimatedDuration: ''
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

  // Fetch task details
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Fetch task details
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${taskId}`);
      setTask(response.data.data);
      
      // Check if user has already applied
      const userBid = response.data.data.bidders?.find(bid => bid.user._id === user._id);
      setHasApplied(!!userBid);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching task details:", err);
      setError("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  // Handle bid form submission
  const handleApplyForTask = async (e) => {
    e.preventDefault();
    
    if (!bidData.bidAmount || !bidData.proposal || !bidData.estimatedDuration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setApplying(true);
      await api.post(`/tasks/${taskId}/bid`, {
        bidAmount: parseFloat(bidData.bidAmount),
        proposal: bidData.proposal,
        estimatedDuration: bidData.estimatedDuration
      });
      
      setHasApplied(true);
      setBidData({ bidAmount: '', proposal: '', estimatedDuration: '' });
      alert("Your bid has been submitted successfully!");
    } catch (err) {
      console.error("Error submitting bid:", err);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setApplying(false);
    }
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "assigned":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "in-progress":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/provider')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Not Found</h2>
          <button
            onClick={() => navigate('/dashboard/provider')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard/provider"
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
              >
                DO IT!
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              <div className="relative profile-dropdown">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {user?.name || 'User'}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {task.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(task.status)}`}>
                  {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyStyle(task.urgency)}`}>
                  {task.urgency?.charAt(0).toUpperCase() + task.urgency?.slice(1)} Priority
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Posted on {formatDate(task.createdAt)}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                {task.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Budget</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(task.budget)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deadline</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {formatDate(task.deadline)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{task.category}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{task.location || 'Remote'}</p>
                </div>
              </div>

              {task.skills && task.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Apply Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Apply for this Task
              </h2>

              {task.status !== 'open' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 19c-3.31 0-6-2.69-6-6 0-.55.45-1 1-1s1 .45 1 1c0 2.21 1.79 4 4 4s4-1.79 4-4c0-.55.45-1 1-1s1 .45 1 1c0 3.31-2.69 6-6 6z"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    This task is no longer accepting applications.
                  </p>
                </div>
              ) : hasApplied ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have already applied for this task. The client will review your proposal and contact you if selected.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplyForTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Bid Amount ($)
                    </label>
                    <input
                      type="number"
                      value={bidData.bidAmount}
                      onChange={(e) => setBidData({...bidData, bidAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your bid amount"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={bidData.estimatedDuration}
                      onChange={(e) => setBidData({...bidData, estimatedDuration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 2 weeks, 1 month"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Proposal
                    </label>
                    <textarea
                      value={bidData.proposal}
                      onChange={(e) => setBidData({...bidData, proposal: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>

            {/* Client Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About the Client
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    {task.client?.name || 'Client Name'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    {task.client?.rating || 'N/A'} Rating
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    Member since {formatDate(task.client?.createdAt || task.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderTaskDetail;
