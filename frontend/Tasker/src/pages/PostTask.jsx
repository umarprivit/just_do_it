import { useState } from "react";

const PostTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    dateTime: "",
    budget: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit task to API
    console.log("Posting task:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="dateTime" placeholder="Date & Time" value={form.dateTime} onChange={handleChange} />
      <input name="budget" placeholder="Budget" value={form.budget} onChange={handleChange} />
      <button type="submit">Post Task</button>
    </form>
  );
};

export default PostTask;
