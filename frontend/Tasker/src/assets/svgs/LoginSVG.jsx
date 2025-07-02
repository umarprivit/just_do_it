const LoginSVG = ({ className = "animate-float" }) => (
  <div className="undraw-container animate-fade-in-up">
    <svg viewBox="0 0 400 300" className={className}>
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

export default LoginSVG;
