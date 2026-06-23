import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, getInterns } from '../api';

export default function AdminTaskForm() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'medium', assignedTo: '' });
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [delayValue, setDelayValue] = useState(1);
  const [delayUnit, setDelayUnit] = useState('minutes');

  useEffect(() => { getInterns().then(setInterns).catch(() => {}); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, dueDate: new Date(form.dueDate) };
    if (scheduleEnabled && delayValue > 0) {
      const ms = delayUnit === 'seconds' ? delayValue * 1000
        : delayUnit === 'hours' ? delayValue * 3600000
        : delayValue * 60000;
      payload.scheduledAt = new Date(Date.now() + ms);
    }
    await createTask(payload);
    navigate('/admin/tasks');
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

        <div className="border-t pt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)} className="rounded" />
            Schedule delayed delivery
          </label>
          {scheduleEnabled && (
            <div className="flex gap-2 items-end ml-6">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Delay</label>
                <input
                  type="number" min="1"
                  value={delayValue}
                  onChange={e => setDelayValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Unit</label>
                <select value={delayUnit} onChange={e => setDelayUnit(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Create Task
        </button>
      </form>
    </div>
  );
}
