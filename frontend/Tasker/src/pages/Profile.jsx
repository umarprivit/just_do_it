import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Profile = () => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState({
    completedTasks: 0,
    totalEarnings: 0,
    rating: 0,
    reviewCount: 0,
  });
  const [userReviews, setUserReviews] = useState([]);

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

  // Profile form validation schema
  const profileSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number")
      .min(10, "Phone number must be at least 10 digits"),
    bio: Yup.string().max(500, "Bio must be less than 500 characters"),
    skills: Yup.string().max(200, "Skills must be less than 200 characters"),
  });

  // Fetch all profile data including tasks and reviews for calculations
  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Get profile data
      const profileResponse = await api.get("/users/profile");
      const profileData = profileResponse.data.data || profileResponse.data;
      setProfileData(profileData);

      // Fetch user's tasks to calculate completed tasks and earnings
      let completedTasks = 0;
      let totalEarnings = 0;

      try {
        const tasksResponse = await api.get("/tasks");
        let allTasks = [];
        allTasks = tasksResponse.data.tasks|| tasksResponse.data || [];

        // Filter tasks that belong to this user and are completed
        if (allTasks.length !== 0) {
          const userCompletedTasks = allTasks.filter((task) => {
            if (profileData.role === "provider") {
              // For providers, count tasks they were assigned to and completed
              return (
                task.assignedTo === profileData._id &&
                task.status === "completed"
              );
            } else {
              // For clients, count tasks they posted and were completed
              return (
                task.client === profileData._id && task.status === "completed"
              );
            }
          });
        }
        const userCompletedTasks = [];

        completedTasks = userCompletedTasks.length;

        // Calculate total earnings for providers
        if (profileData.role === "provider") {
          totalEarnings = userCompletedTasks.reduce(
            (total, task) => total + (task.budget || 0),
            0
          );
        }
      } catch (taskError) {
        console.error("Error fetching tasks for stats:", taskError);
      }

      // Fetch reviews for providers
      let reviews = [];
      if (profileData.role === "provider") {
        try {
          const reviewsResponse = await api.get(`/reviews/${profileData._id}`);
          reviews = reviewsResponse.data || [];
          setUserReviews(reviews);
        } catch (reviewError) {
          console.error("Error fetching reviews:", reviewError);
          setUserReviews([]);
        }
      }

      // Set calculated stats
      setUserStats({
        completedTasks,
        totalEarnings,
        rating: profileData.rating || 0,
        reviewCount: reviews.length || profileData.reviewCount || 0,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Show only first 3 reviews by default
  const displayedReviews = showAllReviews
    ? userReviews
    : userReviews.slice(0, 3);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
      </svg>
    ));
  };

  // Handle form submission
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    try {
      setUpdateError("");
      setUpdateSuccess("");

      const skillsArray = values.skills
        ? values.skills.split(",").map((skill) => skill.trim())
        : [];

      const updateData = {
        name: values.name,
        phone: values.phone,
        bio: values.bio,
        skills: skillsArray,
      };

      const response = await api.put("/users/profile", updateData);

      // Handle different response structures
      const updatedProfile = response.data.data || response.data;

      if (response.data.success !== false) {
        setProfileData(updatedProfile);
        setIsEditing(false);
        setUpdateSuccess("Profile updated successfully!");
        // Refresh all data to get updated stats
        await fetchProfileData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (loading) return;
    if (!user.user) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [user, navigate]);

  // Profile SVG illustration
  const ProfileSVG = () => (
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
        {/* Profile Card */}
        <g className="animate-slide-in-left">
          <rect
            x="150"
            y="80"
            width="200"
            height="140"
            rx="12"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <circle cx="200" cy="120" r="25" fill="#3b82f6" />
          <rect x="170" y="150" width="60" height="8" rx="4" fill="#fb923c" />
          <rect x="160" y="170" width="80" height="6" rx="3" fill="#e2e8f0" />
          <rect x="165" y="185" width="70" height="6" rx="3" fill="#e2e8f0" />
        </g>
        {/* Person Character */}
        <g className="animate-slide-in-right">
          <circle cx="320" cy="150" r="20" fill="#fbbf24" />
          <rect x="310" y="170" width="20" height="30" rx="10" fill="#3b82f6" />
          <circle cx="315" cy="145" r="2" fill="#1f2937" />
          <circle cx="325" cy="145" r="2" fill="#1f2937" />
          <path
            d="M315 155 Q320 160 325 155"
            stroke="#1f2937"
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );

  // Show loading screen
  if (loading || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <Link to="/" className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-primary-main">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl dark:text-primary font-black font-poppins text-gradient-primary">
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
                      className="relative p-3 rounded-full bg-blue-400 border-2 border-solid dark:border-primary-border-dark border-primary-border shadow-lg"
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
                          {/* Dashboard Link */}
                          <Link
                            to={
                              user?.role === "provider"
                                ? "/dashboard/provider"
                                : "/dashboard/client"
                            }
                            className="w-full px-4 py-3 text-left flex items-center space-x-3"
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
                                Manage tasks
                              </div>
                            </div>
                          </Link>

                          {/* Dark Mode Toggle */}
                          <button
                            onClick={() => {
                              toggleDarkMode();
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left flex items-center space-x-3"
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

      {/* Header Section */}
      <section className="px-4 py-8 min-h-fit flex items-center dark:bg-primary-dark bg-primary ">
        <div className="max-w-7xl mx-auto w-full ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[40vh]">
            <div className="animate-slide-in-left flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-black font-poppins mb-6 leading-tight dark:text-primary-hover text-primary-hover-dark">
                <span className="block dark:bg-gradient-to-r dark:from-blue-400 dark:from-25% dark:to-white dark:to-100% dark:bg-clip-text dark:text-transparent ">
                  My Profile
                </span>
              </h1>
              <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-2xl text-secondary-text">
                Manage your personal information, skills, and account settings.
              </p>
            </div>
            <div className="animate-slide-in-right flex items-center justify-center">
              <ProfileSVG />
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <div className="w-full px-6 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <div className="clean-card p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-primary-border dark:border-primary-border-dark shadow-lg sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-primary-text dark:text-primary mb-2">
                    {profileData?.name || "User"}
                  </h2>
                  <p className="text-secondary-text dark:text-secondary-text-dark mb-4">
                    Member since{" "}
                    {profileData?.createdAt
                      ? new Date(profileData.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )
                      : "Unknown"}
                  </p>
                </div>
                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Total Earnings
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      ${userStats.totalEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Completed Tasks
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {userStats.completedTasks}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                      Rating
                    </span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                      {userStats.rating}⭐
                    </span>
                  </div>
                </div>{" "}
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setUpdateError("");
                    setUpdateSuccess("");
                  }}
                  className="w-full mt-6 px-4 py-3 btn-primary rounded-xl text-white font-semibold shadow-lg bg-primary-main"
                >
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-primary-text dark:text-primary">
                  Profile Information
                </h3>

                {/* Success/Error Messages */}
                {updateSuccess && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      {updateSuccess}
                    </p>
                  </div>
                )}

                {updateError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                    <p className="text-red-800 dark:text-red-300 font-medium">
                      {updateError}
                    </p>
                  </div>
                )}

                <Formik
                  initialValues={{
                    name: profileData?.name || "",
                    phone: profileData?.phone || "",
                    bio: profileData?.bio || "",
                    skills: profileData?.skills
                      ? profileData.skills.join(", ")
                      : "",
                  }}
                  validationSchema={profileSchema}
                  onSubmit={handleProfileUpdate}
                  enableReinitialize={true}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-primary-text dark:text-primary mb-2">
                            Full Name
                          </label>
                          <Field
                            name="name"
                            type="text"
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                          <label className="block text-sm font-medium text-primary-text dark:text-primary mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData?.email || ""}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Email cannot be changed
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-primary-text dark:text-primary mb-2">
                          Phone Number
                        </label>
                        <Field
                          name="phone"
                          type="text"
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium text-primary-text dark:text-primary mb-2">
                          Bio
                        </label>
                        <Field
                          name="bio"
                          as="textarea"
                          rows="4"
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed resize-none"
                        />
                        <ErrorMessage
                          name="bio"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-primary-text dark:text-primary mb-2">
                          Skills (comma separated)
                        </label>
                        <Field
                          name="skills"
                          type="text"
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        />
                        <ErrorMessage
                          name="skills"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Submit Button */}
                      {isEditing && (
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 btn-primary rounded-xl text-white font-semibold shadow-lg bg-primary-main disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>

          {/* Reviews Section - Only for Providers */}
          {profileData?.role === "provider" && (
            <div className="mt-12">
              <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-lg">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-primary-text dark:text-primary">
                    Client Reviews
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {renderStars(Math.round(userStats.rating))}
                      </div>
                      <span className="text-lg font-semibold text-primary-text dark:text-primary">
                        {userStats.rating.toFixed(1)}
                      </span>
                      <span className="text-secondary-text dark:text-secondary-text-dark">
                        ({userReviews.length} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {displayedReviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Client Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {review.reviewer?.name?.charAt(0) || "C"}
                            </span>
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-primary-text dark:text-primary">
                                {review.reviewer?.name || "Anonymous Client"}
                              </h4>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Verified
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-700">
                              {review.task?.title || "Task"}
                            </span>
                          </div>

                          <p className="text-secondary-text dark:text-secondary-text-dark leading-relaxed">
                            {review.comment || "No comment provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {userReviews.length > 3 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="px-6 py-3 btn-secondary rounded-xl font-semibold border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 shadow-md"
                    >
                      {showAllReviews ? (
                        <>
                          <svg
                            className="w-5 h-5 inline mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Show Less Reviews
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 inline mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          See All {userReviews.length} Reviews
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* No Reviews State */}
                {userReviews.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h4 className="text-lg font-medium text-secondary-text dark:text-secondary-text-dark mb-2">
                      No Reviews Yet
                    </h4>
                    <p className="text-secondary-text dark:text-secondary-text-dark">
                      Complete your first task to start receiving reviews from
                      clients.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
