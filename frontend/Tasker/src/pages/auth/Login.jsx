import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const Login = () => {
  const { login, dispatch } = useAuth();
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

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      login({ user: res.data, token: res.data.token });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      if (err.response?.status === 401) {
        setFieldError("password", "Invalid email or password");
      } else {
        dispatch({
          type: "AUTH_ERROR",
          payload: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Login Illustration SVG
  const LoginSVG = () => (
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

        {/* Login Device */}
        <g className="animate-slide-in-left">
          <rect
            x="120"
            y="80"
            width="160"
            height="120"
            rx="15"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <rect x="130" y="90" width="140" height="8" rx="4" fill="#f3f4f6" />
          <rect x="130" y="110" width="100" height="6" rx="3" fill="#d1d5db" />
          <rect x="130" y="125" width="120" height="6" rx="3" fill="#d1d5db" />

          {/* Login Form Elements */}
          <rect x="140" y="145" width="120" height="12" rx="6" fill="#3b82f6" />
          <rect x="140" y="165" width="120" height="12" rx="6" fill="#fb923c" />
          <rect x="200" y="185" width="60" height="10" rx="5" fill="#10b981" />
        </g>

        {/* Security Icons */}
        <g className="animate-slide-in-right">
          <circle
            cx="320"
            cy="140"
            r="20"
            fill="#10b981"
            opacity="0.2"
            className="animate-pulse"
          />
          <path
            d="M 315 135 L 318 138 L 325 131"
            stroke="#10b981"
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
          cx="340"
          cy="200"
          r="6"
          fill="#fb923c"
          className="animate-float"
        />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen clean-bg transition-colors duration-500 dark:bg-primary-dark bg-primary w-full W-">
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
                    <h1 className="text-2xl font-black font-poppins text-gradient-primary group-hover:scale-105 transition-transform duration-300">
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

                          {/* Register Link */}
                          <Link
                            to="/register"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5 text-green-600 dark:text-green-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                            </svg>
                            <div className="flex-1">
                              <div className="font-medium text-primary-text dark:text-primary-text-dark">
                                Create Account
                              </div>
                              <div className="text-xs text-secondary-text dark:text-secondary-text-dark">
                                Don't have an account?
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
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-center min-h-[80vh]">
            {/* Illustration */}
            <div className="animate-slide-in-right flex items-center justify-center">
              <LoginSVG />
            </div>
            {/* Login Form */}
            <div className="animate-slide-in-left flex justify-center">
              <div className="clean-card p-8 w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black font-poppins mb-4 text-gradient-primary dark:text-primary-hover-dark">
                    Welcome Back
                  </h2>
                  <p className="text-lg text-secondary-text dark:text-secondary-text-dark">
                    Sign in to continue your journey
                  </p>
                </div>

                {/* Form */}
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-6">
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
                          placeholder="Enter your password"
                          className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-bg-secondary-dark bg-secondary"
                          style={{
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

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="w-full btn-primary px-8 py-4 text-lg hover-lift flex items-center justify-center space-x-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-main-dark bg-primary-main text-white font-semibold"
                      >
                        {isLoading || isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <>
                            <span>Sign In</span>
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
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium hover:underline transition-colors duration-300"
                      style={{
                        color: isDark
                          ? "var(--color-accent-main-dark)"
                          : "var(--color-accent-main)",
                      }}
                    >
                      Create one here
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

export default Login;
