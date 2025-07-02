import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { usePageTitle } from "../../hooks/usePageTitle";

const OtpScreen = () => {
  usePageTitle("Verify OTP");

  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();

  // Get email or phone from location state
  const contact =
    location.state?.email || location.state?.phone || "your account";
  const isEmail = contact.includes("@");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const toggleDarkMode = () => setIsDark(!isDark);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtpValues = pastedData
        .split("")
        .concat(Array(6).fill(""))
        .slice(0, 6);
      setOtpValues(newOtpValues);

      // Focus the next empty input or last input
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Validation schema
  const otpSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("Please enter the OTP"),
  });

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.post("/users/verify-otp", {
        otp: otpValues.join(""),
        email: location.state?.email,
      });
      console.log("OTP verification response:", data);
      if (data) {
        login(data, data.token);
        console.log("OTP verified successfully:", data.user);
        if (data.role === "client") {
          navigate("/dashboard/client");
        } else {
          navigate("/dashboard/provider");
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setTimer(120);
    setCanResend(false);
    setOtpValues(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // TODO: Call resend OTP API
    console.log("Resending OTP to:", contact);
  };

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Combine OTP values for form
  const otpString = otpValues.join("");

  return (
    <div className="min-h-screen clean-bg transition-colors duration-500 dark:bg-primary-dark bg-primary w-full flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="clean-card p-8 border border-primary-border dark:border-primary-border-dark shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo/Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-primary-text dark:text-primary mb-3">
              Verify Your Account
            </h1>
            <p className="text-secondary-text dark:text-secondary-text-dark">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 mt-1">
              {isEmail ? `📧 ${contact}` : `📱 ${contact}`}
            </p>
          </div>

          {/* OTP Form */}
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpSchema}
            enableReinitialize
          >
            {({ setFieldValue, errors, touched }) => {
              // Update Formik when OTP changes
              const currentOtp = otpValues.join("");
              if (currentOtp !== otpString) {
                setFieldValue("otp", currentOtp);
              }

              return (
                <Form className="space-y-6">
                  {/* OTP Input Fields */}
                  <div>
                    <label className="block text-lg font-semibold text-primary-text dark:text-primary mb-4 text-center">
                      Enter Verification Code
                    </label>

                    <div className="flex justify-center space-x-3 mb-4">
                      {otpValues.map((value, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength="1"
                          value={value}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                            errors.otp && touched.otp
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : value
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                          } text-primary-text dark:text-primary`}
                        />
                      ))}
                    </div>

                    {errors.otp && touched.otp && (
                      <div className="text-red-500 text-sm text-center">
                        {errors.otp}
                      </div>
                    )}
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center">
                    {!canResend ? (
                      <p className="text-secondary-text dark:text-secondary-text-dark">
                        Resend code in{" "}
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {formatTimer(timer)}
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
                      >
                        Resend Verification Code
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading || otpString.length !== 6}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      isLoading || otpString.length !== 6
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
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
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify Account"
                    )}
                  </button>
                </Form>
              );
            }}
          </Formik>

          {/* Back Link */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-secondary-text dark:text-secondary-text-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-secondary-text dark:text-secondary-text-dark">
            Didn't receive the code? Check your spam folder or{" "}
            <button
              onClick={handleResendOtp}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              disabled={!canResend}
            >
              try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
