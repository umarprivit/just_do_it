const DashboardSVG = ({ className = "animate-float" }) => (
  <div className="undraw-container animate-fade-in-up">
    <svg viewBox="0 0 400 200" className={className}>
      {/* Background Elements */}
      <circle
        cx="350"
        cy="30"
        r="20"
        fill="#3b82f6"
        opacity="0.1"
        className="animate-pulse"
      />
      <circle
        cx="50"
        cy="170"
        r="15"
        fill="#fb923c"
        opacity="0.1"
        className="animate-pulse"
      />

      {/* Dashboard Screen */}
      <g className="animate-slide-in-left">
        <rect
          x="80"
          y="40"
          width="240"
          height="120"
          rx="12"
          fill="#ffffff"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Header */}
        <rect
          x="90"
          y="50"
          width="220"
          height="20"
          rx="4"
          fill="#3b82f6"
          opacity="0.8"
        />
        <circle cx="300" cy="60" r="6" fill="#fb923c" />

        {/* Task Cards */}
        <rect
          x="100"
          y="80"
          width="60"
          height="30"
          rx="6"
          fill="#10b981"
          opacity="0.3"
        />
        <rect
          x="170"
          y="80"
          width="60"
          height="30"
          rx="6"
          fill="#fb923c"
          opacity="0.3"
        />
        <rect
          x="240"
          y="80"
          width="60"
          height="30"
          rx="6"
          fill="#3b82f6"
          opacity="0.3"
        />

        <rect x="100" y="120" width="200" height="8" rx="4" fill="#f3f4f6" />
        <rect x="100" y="135" width="150" height="6" rx="3" fill="#d1d5db" />
      </g>

      {/* Floating Analytics */}
      <g className="animate-slide-in-right">
        <circle cx="340" cy="100" r="25" fill="#10b981" opacity="0.2" />
        <path
          d="M 330 105 L 335 110 L 350 95"
          stroke="#10b981"
          strokeWidth="2"
          fill="none"
        />
      </g>

      {/* Floating Elements */}
      <circle
        cx="70"
        cy="80"
        r="6"
        fill="#3b82f6"
        className="animate-float"
      />
      <circle
        cx="350"
        cy="150"
        r="4"
        fill="#fb923c"
        className="animate-float"
      />
    </svg>
  </div>
);

export default DashboardSVG;
