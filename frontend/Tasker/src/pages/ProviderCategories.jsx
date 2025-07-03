import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

const ProviderCategories = () => {
  const { category } = useParams();
  usePageTitle(
    `${category ? category.charAt(0).toUpperCase() + category.slice(1) : "Category"
    } Providers`
  );

  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
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

  // Mock providers data - In real app, this would come from API
  const providersData = {
    "web-development": [
      {
        id: 1,
        name: "John Smith",
        title: "Full Stack Developer",
        rating: 4.9,
        reviewCount: 87,
        description:
          "Experienced full-stack developer specializing in React, Node.js, and MongoDB. I create scalable web applications with modern technologies.",
        skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
        completedProjects: 152,
        hourlyRate: 45,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 2 hours",
        location: "New York, USA",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        title: "Frontend Specialist",
        rating: 4.8,
        reviewCount: 64,
        description:
          "Creative frontend developer with 5+ years experience in React, Vue.js, and modern CSS frameworks. Passionate about user experience.",
        skills: ["React", "Vue.js", "Tailwind CSS", "JavaScript", "Figma"],
        completedProjects: 98,
        hourlyRate: 40,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 1 hour",
        location: "California, USA",
      },
      {
        id: 3,
        name: "Alex Chen",
        title: "Backend Engineer",
        rating: 4.7,
        reviewCount: 91,
        description:
          "Backend specialist focused on API development, database optimization, and cloud infrastructure. Expert in Python and Django.",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
        completedProjects: 134,
        hourlyRate: 50,
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 3 hours",
        location: "Seattle, USA",
      },
    ],
    "graphic-design": [
      {
        id: 4,
        name: "Emily Rodriguez",
        title: "Brand Designer",
        rating: 4.9,
        reviewCount: 73,
        description:
          "Creative brand designer with expertise in logo design, brand identity, and marketing materials. I help businesses stand out.",
        skills: [
          "Logo Design",
          "Branding",
          "Adobe Creative Suite",
          "Figma",
          "Illustration",
        ],
        completedProjects: 186,
        hourlyRate: 35,
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 1 hour",
        location: "Austin, USA",
      },
      {
        id: 5,
        name: "Michael Brown",
        title: "Visual Designer",
        rating: 4.8,
        reviewCount: 56,
        description:
          "Versatile graphic designer specializing in print and digital design. From business cards to website graphics, I do it all.",
        skills: [
          "Print Design",
          "Digital Design",
          "Photoshop",
          "Illustrator",
          "InDesign",
        ],
        completedProjects: 142,
        hourlyRate: 30,
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 2 hours",
        location: "Chicago, USA",
      },
    ],
    writing: [
      {
        id: 6,
        name: "Lisa Davis",
        title: "Content Writer",
        rating: 4.9,
        reviewCount: 112,
        description:
          "Professional content writer with expertise in blog posts, web copy, and SEO content. I help businesses tell their story effectively.",
        skills: [
          "Content Writing",
          "SEO",
          "Blog Writing",
          "Copywriting",
          "Research",
        ],
        completedProjects: 298,
        hourlyRate: 25,
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 1 hour",
        location: "Boston, USA",
      },
      {
        id: 7,
        name: "David Wilson",
        title: "Technical Writer",
        rating: 4.8,
        reviewCount: 45,
        description:
          "Specialized technical writer with experience in documentation, API guides, and user manuals for software companies.",
        skills: [
          "Technical Writing",
          "Documentation",
          "API Writing",
          "User Guides",
          "Markdown",
        ],
        completedProjects: 67,
        hourlyRate: 35,
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 4 hours",
        location: "Portland, USA",
      },
    ],
    "ui-ux-design": [
      {
        id: 8,
        name: "Jessica Kim",
        title: "UX/UI Designer",
        rating: 4.9,
        reviewCount: 89,
        description:
          "User-centered designer with expertise in mobile and web app design. I create intuitive interfaces that users love.",
        skills: [
          "UI Design",
          "UX Research",
          "Figma",
          "Prototyping",
          "User Testing",
        ],
        completedProjects: 156,
        hourlyRate: 55,
        avatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 2 hours",
        location: "San Francisco, USA",
      },
      {
        id: 9,
        name: "Ryan Martinez",
        title: "Product Designer",
        rating: 4.7,
        reviewCount: 72,
        description:
          "Product designer focused on creating seamless user experiences for SaaS platforms and mobile applications.",
        skills: [
          "Product Design",
          "User Research",
          "Sketch",
          "InVision",
          "Design Systems",
        ],
        completedProjects: 103,
        hourlyRate: 60,
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 3 hours",
        location: "Los Angeles, USA",
      },
    ],
    "data-science": [
      {
        id: 10,
        name: "Dr. Amanda Foster",
        title: "Data Scientist",
        rating: 4.9,
        reviewCount: 34,
        description:
          "PhD in Data Science with expertise in machine learning, statistical analysis, and data visualization for business insights.",
        skills: ["Python", "R", "Machine Learning", "SQL", "Tableau"],
        completedProjects: 78,
        hourlyRate: 75,
        avatar:
          "https://images.unsplash.com/photo-1559941285-2ae4b9b5b8c4?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 6 hours",
        location: "Cambridge, USA",
      },
      {
        id: 11,
        name: "Kevin Zhang",
        title: "ML Engineer",
        rating: 4.8,
        reviewCount: 56,
        description:
          "Machine learning engineer specializing in deep learning, computer vision, and natural language processing applications.",
        skills: ["TensorFlow", "PyTorch", "Computer Vision", "NLP", "AWS"],
        completedProjects: 89,
        hourlyRate: 70,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        responseTime: "Within 4 hours",
        location: "Silicon Valley, USA",
      },
    ],
  };

  // Get category info
  const getCategoryInfo = (categorySlug) => {
    const categoryMap = {
      "web-development": {
        name: "Web Development",
        icon: "M14,12L10,8L8.5,9.5L11,12L8.5,14.5L10,16L14,12M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,4V20H18V4H6Z",
        color: "blue",
        description: "Find skilled web developers for your projects",
      },
      "graphic-design": {
        name: "Graphic Design",
        icon: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z",
        color: "purple",
        description: "Connect with creative graphic designers",
      },
      writing: {
        name: "Writing",
        icon: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",
        color: "green",
        description: "Hire professional writers for your content needs",
      },
      "ui-ux-design": {
        name: "UI/UX Design",
        icon: "M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z",
        color: "pink",
        description: "Find UX/UI designers for your digital products",
      },
      "data-science": {
        name: "Data Science",
        icon: "M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17M19.5,19.1H4.5V5H6.5V17.1H19.5V19.1Z",
        color: "indigo",
        description: "Connect with data scientists and analysts",
      },
    };
    return (
      categoryMap[categorySlug] || {
        name: "Category",
        icon: "",
        color: "gray",
        description: "",
      }
    );
  };

  const categoryInfo = getCategoryInfo(category);
  const providers = providersData[category] || [];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
        </svg>
      );
    }

    return stars;
  };

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
                    <h1 className="text-2xl font-black font-poppins dark:text-white text-black group-hover:scale-105 transition-transform duration-300">
                      DO IT!
                    </h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Find Providers
                    </span>
                  </div>
                </Link>

                {/* Back to Dashboard */}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-main dark:bg-primary-main-dark text-white rounded-xl hover-lift transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                  <span>Back to Dashboard</span>
                </Link>
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
            <div className="flex items-center space-x-4 mb-6">
              <div
                className={`w-16 h-16 bg-gradient-to-br from-${categoryInfo.color}-100 to-${categoryInfo.color}-200 dark:from-${categoryInfo.color}-900/30 dark:to-${categoryInfo.color}-800/30 rounded-2xl flex items-center justify-center`}
              >
                <svg
                  className={`w-8 h-8 text-${categoryInfo.color}-600 dark:text-${categoryInfo.color}-400`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={categoryInfo.icon} />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-black font-poppins text-primary-text dark:text-white mb-2">
                  {categoryInfo.name} Providers
                </h1>
                <p className="text-xl text-secondary-text dark:text-secondary-text-dark">
                  {categoryInfo.description}
                </p>
              </div>
            </div>


          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="clean-card p-6 hover-lift transition-all duration-300 border border-primary-border dark:border-primary-border-dark hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl group relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/50 dark:from-blue-900/10 dark:to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Provider Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-text dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {provider.name}
                      </h3>
                      <p className="text-secondary-text dark:text-secondary-text-dark font-medium mb-2">
                        {provider.title}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(provider.rating)}
                        </div>
                        <span className="font-semibold text-primary-text dark:text-white">
                          {provider.rating}
                        </span>
                        <span className="text-sm text-secondary-text dark:text-secondary-text-dark">
                          ({provider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-secondary-text dark:text-secondary-text-dark mb-4 line-clamp-3 leading-relaxed">
                    {provider.description}
                  </p>                 

                  {/* Contact Button */}
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group-hover:scale-105">
                    Contact Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {providers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 17v2H2v-2s0-4 7-4 7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-text dark:text-primary-text-dark mb-4">
                No providers found
              </h3>
              <p className="text-secondary-text dark:text-secondary-text-dark mb-8">
                There are currently no providers available in this category.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-primary-main dark:bg-primary-main-dark text-white rounded-xl hover-lift transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                <span>Back to Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderCategories;
