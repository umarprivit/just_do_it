const StatsSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="clean-card p-6 text-center animate-pulse"
        >
          {/* Icon skeleton */}
          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto mb-4"></div>
          {/* Number skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-16 mx-auto"></div>
          {/* Label skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </>
  );
};

export default StatsSkeleton;
