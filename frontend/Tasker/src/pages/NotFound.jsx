import { usePageTitle } from "../hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">
          404
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Page Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFound;
