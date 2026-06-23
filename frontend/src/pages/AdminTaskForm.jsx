import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, getInterns } from '../api';

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none transition-all duration-200";
const labelClass = "block text-xs font-medium text-gray-600 mb-1.5";

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
    <div className="max-w-3xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">New Task</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required className={inputClass}>
              <option value="">Select Intern</option>
              {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <label className="relative inline-flex items-center cursor-pointer gap-3">
            <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-sm" />
            <span className="text-sm font-medium text-gray-700">Schedule delayed delivery</span>
          </label>
          {scheduleEnabled && (
            <div className="flex gap-3 mt-3 ml-12 animate-fadeIn">
              <div className="w-32">
                <label className="text-xs text-gray-500 mb-1 block">Delay</label>
                <input type="number" min="1" value={delayValue} onChange={e => setDelayValue(Math.max(1, parseInt(e.target.value) || 1))} className={inputClass} />
              </div>
              <div className="w-36">
                <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                <select value={delayUnit} onChange={e => setDelayUnit(e.target.value)} className={inputClass}>
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
          Create Task
        </button>
      </form>
    </div>
  );
}
