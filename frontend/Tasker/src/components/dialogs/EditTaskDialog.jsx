import { useState, useEffect } from "react";
import { Dialog } from "../ui";

const EditTaskDialog = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    priority: "medium",
    skills: [],
    urgency: "normal",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "",
        budget: task.budget || "",
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "",
        skills: task.skills || [],
        urgency: task.urgency || "medium",
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.category) {
        throw new Error("Category is required");
      }
      if (!formData.budget || formData.budget <= 0) {
        throw new Error("Budget must be greater than 0");
      }
      if (!formData.deadline) {
        throw new Error("Deadline is required");
      }

      // Check if deadline is in the future
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error("Deadline must be in the future");
      }

      // Create a task object with only the fields that need to be updated
      const updatedTask = {
        id: task.id, // Ensure we're using the correct ID field
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budget: parseFloat(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
        urgency: formData.urgency,
        skillsRequired: formData.skills, // Make sure the field name matches what the API expects
      };

      console.log("Sending updated task to API:", updatedTask);
      await onSave(updatedTask);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Web Development",
    "Graphic Design",
    "Writing",
    "UI/UX Design",
    "Data Science",
    "Mobile Development",
    "Digital Marketing",
    "Translation",
    "Video Editing",
    "Photography",
    "Other",
  ];

  const urgencyLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget ($) *
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              min="1"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline *
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Priority */}

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Urgency
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {urgencyLevels.map((urgency) => (
                <option key={urgency.value} value={urgency.value}>
                  {urgency.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Required Skills
            </label>
            <input
              type="text"
              value={formData.skills.join(", ")}
              onChange={handleSkillsChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter skills separated by commas
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Describe your task in detail..."
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditTaskDialog;
