import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  PostTaskSVG,
  LogoIcon,
  BackArrowIcon,
  UserIcon,
} from "../../assets/svgs";
import api from "../../services/api";

const PostTask = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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

  // Get current location using GPS (coordinates only)
  const getCurrentLocation = (setFieldValue) => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Just use coordinates
        const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setCurrentLocation(coords);
        if (setFieldValue) {
          setFieldValue("location", coords);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }

        alert(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Task form validation schema
  const taskSchema = Yup.object().shape({
    title: Yup.string()
      .min(10, "Title must be at least 10 characters")
      .max(100, "Title must be less than 100 characters")
      .required("Task title is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must be less than 2000 characters")
      .required("Task description is required"),
    category: Yup.string().required("Please select a category"),
    budget: Yup.number()
      .min(5, "Budget must be at least $5")
      .max(50000, "Budget must be less than $50,000")
      .required("Budget is required"),
    deadline: Yup.date()
      .min(new Date(), "Deadline must be in the future")
      .required("Deadline is required"),
    location: Yup.string()
      .min(5, "Please provide a valid address")
      .required("Task location/address is required"),
    skillsRequired: Yup.string().max(
      500,
      "Skills description must be less than 500 characters"
    ),
    urgency: Yup.string().required("Please select urgency level"),
  });

  // Categories for dropdown
  const categories = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Graphic Design",
    "Writing & Translation",
    "Digital Marketing",
    "Data Science",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
    "Other",
  ];

  // Post Task SVG Illustration
  const PostTaskSVG = () => (
    <div className="undraw-container animate-fade-in-up">
      <svg viewBox="0 0 400 300" className="animate-float">
        {/* Background Elements */}
        <circle
          cx="350"
          cy="50"
          r="25"
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
        {/* Task Board */}
        <g className="animate-slide-in-left">
          <rect
            x="120"
            y="60"
            width="160"
            height="180"
            rx="12"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <rect x="135" y="80" width="130" height="15" rx="4" fill="#3b82f6" />
          <rect x="135" y="105" width="100" height="8" rx="4" fill="#fb923c" />
          <rect x="135" y="125" width="120" height="8" rx="4" fill="#e2e8f0" />
          <rect x="135" y="145" width="90" height="8" rx="4" fill="#e2e8f0" />
          <rect x="135" y="170" width="60" height="20" rx="10" fill="#10b981" />
        </g>
        {/* Person Character */}
        <g className="animate-slide-in-right">
          <circle cx="320" cy="140" r="20" fill="#fbbf24" />
          <rect x="310" y="160" width="20" height="30" rx="10" fill="#3b82f6" />
          <circle cx="315" cy="135" r="2" fill="#1f2937" />
          <circle cx="325" cy="135" r="2" fill="#1f2937" />
          <path
            d="M315 145 Q320 150 325 145"
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
                          {/* Dashboard Link */}
                          <Link
                            to="/dashboard-client"
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
                                Manage tasks
                              </div>
                            </div>
                          </Link>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[50vh]">
            <div className="animate-slide-in-left flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-black font-poppins mb-6 leading-tight dark:text-primary-hover text-primary-hover-dark">
                <span className="block dark:bg-gradient-to-r dark:from-blue-400 dark:from-25% dark:to-white dark:to-100% dark:bg-clip-text dark:text-transparent ">
                  Post a New Task
                </span>
                <span className="block mt-2 dark:text-accent-main text-accent-main-dark">
                  Find the Perfect Provider
                </span>
              </h1>
              <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-2xl text-secondary-text">
                Describe your project in detail and connect with skilled
                providers ready to bring your vision to life.
              </p>
            </div>
            <div className="animate-slide-in-right flex items-center justify-center">
              <PostTaskSVG />
            </div>
          </div>
        </div>
      </section>

      {/* Task Form */}
      <div className="w-full px-6 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-lg">
            <Formik
              initialValues={{
                title: "",
                description: "",
                category: "",
                budget: "",
                deadline: "",
                location: "",
                skillsRequired: "",
                urgency: "medium",
              }}
              validationSchema={taskSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("Posting task:", values);
                // TODO: Submit to API
                setTimeout(() => {
                  setSubmitting(false);
                  resetForm();
                  navigate("/dashboard-client");
                }, 2000);
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-8">
                  {/* Task Title */}
                  <div>
                    <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                      Task Title *
                    </label>
                    <Field
                      name="title"
                      type="text"
                      placeholder="e.g., Build a responsive e-commerce website with payment integration"
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  {/* Category and Budget Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                        Category *
                      </label>
                      <Field
                        name="category"
                        as="select"
                        className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                        Budget (USD) *
                      </label>
                      <Field
                        name="budget"
                        type="number"
                        placeholder="e.g., 500"
                        className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg"
                      />
                      <ErrorMessage
                        name="budget"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                      Task Description *
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      rows="6"
                      placeholder="Provide a detailed description of your project, including specific requirements, deliverables, and any important details providers should know..."
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg resize-none"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                    <div className="text-sm text-secondary-text dark:text-secondary-text-dark mt-2">
                      {values.description.length}/2000 characters
                    </div>
                  </div>

                  {/* Deadline and Location Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deadline */}
                    <div>
                      <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                        Deadline *
                      </label>
                      <Field
                        name="deadline"
                        type="date"
                        className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg"
                      />
                      <ErrorMessage
                        name="deadline"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>

                    {/* Location/Address */}
                    <div>
                      <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                        Task Location/Address *
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Field
                            name="location"
                            type="text"
                            placeholder="Enter task address or location"
                            className="px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg flex-1 min-w-1"
                          />
                          <button
                            type="button"
                            onClick={() => getCurrentLocation(setFieldValue)}
                            disabled={isGettingLocation}
                            className=" flex-1 px-4 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 min-w-fit"
                          >
                            {isGettingLocation ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span className="hidden sm:inline">
                                  Getting...
                                </span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                <span className="hidden sm:inline">
                                  Use GPS
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                          Click "Use GPS" to automatically detect your current
                          location, or manually enter the task address.
                        </div>
                      </div>
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                      Skills Required
                    </label>
                    <Field
                      name="skillsRequired"
                      type="text"
                      placeholder="e.g., React, Node.js, MongoDB, UI/UX Design (comma separated)"
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-primary-text dark:text-primary text-lg"
                    />
                    <ErrorMessage
                      name="skillsRequired"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                    <div className="text-sm text-secondary-text dark:text-secondary-text-dark mt-2">
                      List the key skills or technologies needed for this
                      project
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-3">
                      Priority Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        <Field
                          type="radio"
                          name="urgency"
                          value="low"
                          className="mr-3 w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-primary-text dark:text-primary">
                            Low Priority
                          </div>
                          <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                            Flexible timeline
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        <Field
                          type="radio"
                          name="urgency"
                          value="medium"
                          className="mr-3 w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-primary-text dark:text-primary">
                            Medium Priority
                          </div>
                          <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                            Standard timeline
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        <Field
                          type="radio"
                          name="urgency"
                          value="high"
                          className="mr-3 w-5 h-5 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-primary-text dark:text-primary">
                            High Priority
                          </div>
                          <div className="text-sm text-secondary-text dark:text-secondary-text-dark">
                            Urgent delivery
                          </div>
                        </div>
                      </label>
                    </div>
                    <ErrorMessage
                      name="urgency"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-8 py-4 btn-primary rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary-main disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Posting Task...
                        </div>
                      ) : (
                        "Post Task"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard-client")}
                      className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTask;
