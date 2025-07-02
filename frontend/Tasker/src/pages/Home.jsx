import { Link } from "react-router-dom";

const Home = () => {
  // Animated Undraw Character - Collaboration
  const CollaborationSVG = () => (
    <div className="undraw-container animate-fade-in-up">
      <svg viewBox="0 0 400 300" className="animate-float">
        {/* Background Elements */}
        <circle
          cx="350"
          cy="50"
          r="40"
          fill="#3b82f6"
          opacity="0.08"
          className="animate-pulse"
        />
        <circle
          cx="50"
          cy="250"
          r="30"
          fill="#34d399"
          opacity="0.08"
          className="animate-pulse"
        />
        {/* People */}
        <g className="animate-slide-in-left">
          <circle cx="120" cy="80" r="25" fill="#fb923c" />
          <rect x="100" y="105" width="40" height="60" rx="20" fill="#3b82f6" />
          <rect x="110" y="120" width="20" height="40" fill="#60a5fa" />
        </g>
        <g className="animate-slide-in-right">
          <circle cx="280" cy="80" r="25" fill="#ea580c" />
          <rect x="260" y="105" width="40" height="60" rx="20" fill="#10b981" />
          <rect x="270" y="120" width="20" height="40" fill="#d1fae5" />
        </g>
        {/* Connection Lines */}
        <path
          d="M 160 130 Q 200 110 240 130"
          stroke="#1e40af"
          strokeWidth="3"
          fill="none"
          className="animate-pulse"
          strokeDasharray="5,5"
        />
        {/* Task Icons */}
        <g className="animate-float">
          <rect
            x="180"
            y="200"
            width="40"
            height="30"
            rx="8"
            fill="#ea580c"
            opacity="0.8"
          />
          <circle cx="200" cy="215" r="8" fill="#fff" />
        </g>
      </svg>
    </div>
  );

  // Animated Undraw Character - Task Management
  

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
                <div className="flex items-center space-x-2">
                  {/* Dark Mode Toggle */}
                  {/* <div className="relative">
                    <button
                      onClick={toggleDarkMode}
                      className="relative p-3 rounded-full hover-lift transition-all duration-300  bg-accent-bg "
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {isDark ? (
                          <svg
                            className="w-7 h-7 text-black  transition-all duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-7 h-7 text-black transition-all duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div> */}
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="relative group px-6 py-3 overflow-hidden rounded-xl hover-lift transition-all duration-300 dark:bg-primary-dark bg-secondary text-primary-main border-[1.5px] border-solid border-primary-main"
                  >
                    <span className="relative font-medium group-hover:text-accent-main-dark transition-colors duration-300 dark:text-white ">
                      Login
                    </span>
                  </Link>
                  {/* Register Button */}
                  <Link to="/register" className="relative group">
                    <div className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 bg-primary-main text-white ">
                      <span>Register</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="px-4 py-8 min-h-fit flex items-center dark:bg-primary-dark bg-primary ">
        <div className="max-w-7xl mx-auto w-full ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Hero Content */}
            <div className="animate-slide-in-left flex flex-col justify-center">
              {/* Announcement */}
              <div className="mb-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full hover-lift transition-all duration-300 group bg-primary border-[1.5px] border-solid border-primary-main text-primary-main">
                  <span className="text-2xl mr-3 animate-bounce-gentle">
                    📣
                  </span>
                  <span className="font-semibold group-hover:text-accent-main transition-colors duration-300">
                    Connecting Communities, One Task at a Time
                  </span>
                  <span className="text-2xl ml-3 animate-float">✨</span>
                </div>
              </div>
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-poppins mb-6 leading-tight dark:text-primary-hover text-primary-hover-dark">
                <span className="block dark:bg-gradient-to-r dark:from-blue-400 dark:from-25% dark:to-white dark:to-100% dark:bg-clip-text dark:text-transparent ">
                  Find Local Help
                </span>
                <span className="block mt-2 dark:text-accent-main text-accent-main-dark">
                  for Your Tasks
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-8 leading-relaxed max-w-2xl text-secondary-text">
                From cleaning and cooking to car washing and more - connect with
                <span className="font-bold dark:bg-gradient-to-l dark:from-accent-main-dark dark:from-30% dark:to-white dark:to-100% dark:bg-clip-text dark:text-transparent text-accent-main">
                  {" "}
                  trusted local providers
                </span>
                and get your tasks done efficiently and safely.
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link to="/post-task" className="group">
                  <div className="btn-primary px-8 py-4 text-lg hover-lift flex items-center justify-center space-x-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl bg-primary-main text-white">
                    <span>Post a Task</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </div>
                </Link>
                <Link to="/register" className="group">
                  <div className="px-8 py-4 text-lg hover-lift flex items-center justify-center space-x-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-primary-dark bg-primary text-accent-main border-2 border-solid border-accent-main">
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                    </svg>
                    <span>Become a Provider</span>
                  </div>
                </Link>
              </div>
              {/* Simple Tagline */}
              <div className="text-center sm:text-left ">
                <p className="text-lg font-medium text-secondary-text">
                  Trusted by thousands • Secure payments • Community rated
                </p>
              </div>
            </div>
            {/* Hero Illustration */}
            <div className="animate-slide-in-right flex items-center justify-center">
              <CollaborationSVG />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
