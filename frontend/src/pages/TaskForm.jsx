import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, getInterns } from '../api';

export default function TaskForm() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'medium', assignedTo: '' });

  useEffect(() => { getInterns().then(setInterns).catch(() => {}); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({ ...form, dueDate: new Date(form.dueDate) });
    navigate('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">New Task</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select Intern</option>
            {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Create Task
        </button>
      </form>
    </div>
  );
}
