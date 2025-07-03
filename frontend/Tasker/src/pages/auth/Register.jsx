import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { usePageTitle } from "../../hooks/usePageTitle";

const Register = () => {
  usePageTitle("Register");

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    if (!loading && user) {
      if (user.user.role === "client") {
        navigate("/dashboard/client", { replace: true });
      } else if (user.user.role === "provider") {
        navigate("/dashboard/provider", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
    role: Yup.string()
      .oneOf(["client", "provider"], "Please select a valid role")
      .required("Role is required"),
    skills: Yup.string().when("role", {
      is: "provider",
      then: (schema) => schema.required("Skills are required for providers"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "client",
    skills: "",
  };

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      const submitData = { ...values };
      delete submitData.confirmPassword; // Remove confirmPassword before sending to API

      const { data } = await api.post("/users/register", submitData);
      navigate("/verify", { state: { email: values.email } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      if (err.response?.status === 400) {
        // Handle specific field errors
        if (errorMessage.includes("email")) {
          setFieldError("email", "This email is already registered");
        } else {
          setFieldError("general", errorMessage);
        }
      } else {
        setFieldError("general", errorMessage);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Register Illustration SVG
  const RegisterSVG = () => (
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
          r="25"
          fill="#fb923c"
          opacity="0.1"
          className="animate-pulse"
        />

        {/* Registration Form Device */}
        <g className="animate-slide-in-left">
          <rect
            x="100"
            y="60"
            width="200"
            height="160"
            rx="20"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          {/* Header */}
          <rect x="120" y="80" width="160" height="12" rx="6" fill="#3b82f6" />

          {/* Form Fields */}
          <rect x="120" y="105" width="160" height="8" rx="4" fill="#f3f4f6" />
          <rect x="120" y="120" width="140" height="8" rx="4" fill="#f3f4f6" />
          <rect x="120" y="135" width="120" height="8" rx="4" fill="#f3f4f6" />
          <rect x="120" y="150" width="160" height="8" rx="4" fill="#f3f4f6" />

          {/* Role Selection */}
          <circle cx="130" cy="175" r="4" fill="#fb923c" />
          <circle cx="170" cy="175" r="4" fill="#e5e7eb" />
          <text x="140" y="180" fontSize="8" fill="#6b7280">
            Client
          </text>
          <text x="180" y="180" fontSize="8" fill="#6b7280">
            Provider
          </text>

          {/* Submit Button */}
          <rect x="140" y="195" width="120" height="15" rx="8" fill="#10b981" />
        </g>

        {/* User Icons */}
        <g className="animate-slide-in-right">
          <circle cx="320" cy="120" r="25" fill="#10b981" opacity="0.2" />
          <circle cx="320" cy="115" r="8" fill="#10b981" />
          <path
            d="M 310 135 Q 320 125 330 135"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
          />

          <circle cx="340" cy="180" r="20" fill="#fb923c" opacity="0.2" />
          <circle cx="340" cy="175" r="6" fill="#fb923c" />
          <path
            d="M 332 190 Q 340 182 348 190"
            stroke="#fb923c"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Floating Elements */}
        <circle
          cx="80"
          cy="120"
          r="8"
          fill="#3b82f6"
          className="animate-float"
        />
        <circle
          cx="360"
          cy="220"
          r="6"
          fill="#fb923c"
          className="animate-float"
        />
        <rect
          x="70"
          y="200"
          width="12"
          height="12"
          rx="3"
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
                    <h1 className="text-2xl font-black font-poppins text-gradient-primary group-hover:scale-105 transition-transform duration-300 dark:text-primary">
                      DO IT!
                    </h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Task Platform
                    </span>
                  </div>
                </Link>

                {/* Navigation Items */}
                <div className="flex items-center space-x-4">
                  {/* Home Button */}
                  <Link
                    to="/"
                    className="relative group px-4 py-2 overflow-hidden rounded-xl hover-lift transition-all duration-300 bg-secondary dark:bg-bg-secondary-dark shadow-lg hover:shadow-xl border-2 border-solid dark:border-primary-border-dark border-primary-border text-primary-main dark:text-primary-main-dark"
                  >
                    <span className="relative font-medium group-hover:text-accent-main transition-colors duration-300">
                      Home
                    </span>
                  </Link>

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

                          {/* Login Link */}
                          <Link
                            to="/login"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-primary-text dark:text-primary">
                                Sign In
                              </div>
                              <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                                Already have an account?
                              </div>
                            </div>
                          </Link>
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
      <div className="flex items-center justify-center min-h-screen px-6 py-8 w-full">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-center min-h-[80vh]">
            {/* Illustration */}
            <div className="animate-slide-in-right flex items-center justify-center">
              <RegisterSVG />
            </div>
            {/* Registration Form */}
            <div className="animate-slide-in-left flex justify-center">
              <div className="clean-card p-8 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black font-poppins mb-4 text-gradient-primary dark:text-primary-hover-dark">
                    Join DO IT!
                  </h2>
                  <p className="text-lg text-secondary-text dark:text-secondary-text-dark">
                    Create your account and start your journey
                  </p>
                </div>

                {/* Form */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched, values }) => (
                    <Form className="space-y-6">
                      {/* General Error */}
                      {errors.general && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                          {errors.general}
                        </div>
                      )}

                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Input */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          >
                            Full Name
                          </label>
                          <Field
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                              background: isDark
                                ? "var(--color-bg-secondary-dark)"
                                : "var(--color-secondary)",
                              borderColor:
                                errors.name && touched.name
                                  ? "#ef4444"
                                  : isDark
                                  ? "var(--color-primary-border-dark)"
                                  : "var(--color-primary-border)",
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        {/* Email Input */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          >
                            Email Address
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                              background: isDark
                                ? "var(--color-bg-secondary-dark)"
                                : "var(--color-secondary)",
                              borderColor:
                                errors.email && touched.email
                                  ? "#ef4444"
                                  : isDark
                                  ? "var(--color-primary-border-dark)"
                                  : "var(--color-primary-border)",
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2"
                          style={{
                            color: isDark
                              ? "var(--color-text-primary-dark)"
                              : "var(--color-primary-text)",
                          }}
                        >
                          Phone Number
                        </label>
                        <Field
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            background: isDark
                              ? "var(--color-bg-secondary-dark)"
                                : "var(--color-secondary)",
                            borderColor:
                              errors.phone && touched.phone
                                ? "#ef4444"
                                : isDark
                                ? "var(--color-primary-border-dark)"
                                : "var(--color-primary-border)",
                            color: isDark
                              ? "var(--color-text-primary-dark)"
                              : "var(--color-primary-text)",
                          }}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Password Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password Input */}
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          >
                            Password
                          </label>
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                              background: isDark
                                ? "var(--color-bg-secondary-dark)"
                                : "var(--color-secondary)",
                              borderColor:
                                errors.password && touched.password
                                  ? "#ef4444"
                                  : isDark
                                  ? "var(--color-primary-border-dark)"
                                  : "var(--color-primary-border)",
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          >
                            Confirm Password
                          </label>
                          <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{
                              background: isDark
                                ? "var(--color-bg-secondary-dark)"
                                : "var(--color-secondary)",
                              borderColor:
                                errors.confirmPassword &&
                                touched.confirmPassword
                                  ? "#ef4444"
                                  : isDark
                                  ? "var(--color-primary-border-dark)"
                                  : "var(--color-primary-border)",
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      {/* Role Selection */}
                      <div>
                        <label
                          className="block text-sm font-medium mb-3"
                          style={{
                            color: isDark
                              ? "var(--color-text-primary-dark)"
                              : "var(--color-primary-text)",
                          }}
                        >
                          I want to join as a:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="relative cursor-pointer">
                            <Field
                              type="radio"
                              name="role"
                              value="client"
                              className="sr-only"
                            />
                            <div
                              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                                values.role === "client"
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                              style={{
                                background:
                                  values.role === "client"
                                    ? isDark
                                      ? "rgba(59, 130, 246, 0.1)"
                                      : "rgba(59, 130, 246, 0.05)"
                                    : isDark
                                    ? "var(--color-bg-secondary-dark)"
                                    : "var(--color-secondary)",
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    values.role === "client"
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {values.role === "client" && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <div>
                                  <h3
                                    className="font-semibold text-lg"
                                    style={{
                                      color: isDark
                                        ? "var(--color-text-primary-dark)"
                                        : "var(--color-primary-text)",
                                    }}
                                  >
                                    Client
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    I need tasks to be done
                                  </p>
                                </div>
                              </div>
                            </div>
                          </label>

                          <label className="relative cursor-pointer">
                            <Field
                              type="radio"
                              name="role"
                              value="provider"
                              className="sr-only"
                            />
                            <div
                              className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                                values.role === "provider"
                                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                              style={{
                                background:
                                  values.role === "provider"
                                    ? isDark
                                      ? "rgba(251, 146, 60, 0.1)"
                                      : "rgba(251, 146, 60, 0.05)"
                                    : isDark
                                    ? "var(--color-bg-secondary-dark)"
                                    : "var(--color-secondary)",
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    values.role === "provider"
                                      ? "border-orange-500 bg-orange-500"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {values.role === "provider" && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <div>
                                  <h3
                                    className="font-semibold text-lg"
                                    style={{
                                      color: isDark
                                        ? "var(--color-text-primary-dark)"
                                        : "var(--color-primary-text)",
                                    }}
                                  >
                                    Provider
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    I want to complete tasks
                                  </p>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {/* Skills Input (conditional) */}
                      {values.role === "provider" && (
                        <div className="animate-slide-in-up">
                          <label
                            htmlFor="skills"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          >
                            Your Skills
                          </label>
                          <Field
                            id="skills"
                            name="skills"
                            type="text"
                            placeholder="e.g., Web Development, Graphic Design, Writing"
                            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            style={{
                              background: isDark
                                ? "var(--color-bg-secondary-dark)"
                                : "var(--color-secondary)",
                              borderColor:
                                errors.skills && touched.skills
                                  ? "#ef4444"
                                  : isDark
                                  ? "var(--color-primary-border-dark)"
                                  : "var(--color-primary-border)",
                              color: isDark
                                ? "var(--color-text-primary-dark)"
                                : "var(--color-primary-text)",
                            }}
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Separate multiple skills with commas
                          </p>
                          <ErrorMessage
                            name="skills"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="w-full btn-primary px-8 py-4 text-lg hover-lift flex items-center justify-center space-x-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-main-dark bg-primary-main text-white font-semibold"
                      >
                        {isLoading || isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                            </svg>
                          </>
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-sm dark:text-text-secondary-dark text-secondary-text">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium hover:underline transition-colors duration-300"
                      style={{
                        color: isDark
                          ? "var(--color-accent-main-dark)"
                          : "var(--color-accent-main)",
                      }}
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
