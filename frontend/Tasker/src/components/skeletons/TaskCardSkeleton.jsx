const TaskCardSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="clean-card p-6 border border-primary-border dark:border-primary-border-dark animate-pulse"
        >
          {/* Header skeleton */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-start space-x-3 mb-3">
                {/* Category icon skeleton */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 min-w-0">
                  {/* Title skeleton */}
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                  {/* Category badge skeleton */}
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </div>
            {/* Status and priority skeleton */}
            <div className="flex flex-col items-end space-y-2 ml-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
            </div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>

          {/* Stats skeleton */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="flex justify-between items-center py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
            </div>
            <div className="flex justify-between items-center py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex space-x-2">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TaskCardSkeleton;
