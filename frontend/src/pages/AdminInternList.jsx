import { useState, useEffect } from 'react';
import { getInterns, createIntern, deleteIntern } from '../api';

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none transition-all duration-200";

export default function AdminInternList() {
  const [interns, setInterns] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');

  const fetchInterns = async () => {
    try { setInterns(await getInterns()); } catch { /* ignore */ }
  };

  useEffect(() => { fetchInterns(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    await createIntern({ name, email, department });
    setName(''); setEmail(''); setDepartment('');
    fetchInterns();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this intern?')) return;
    await deleteIntern(id);
    fetchInterns();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Manage Interns</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} />
          </div>
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Department</label>
            <input value={department} onChange={e => setDepartment(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98]">
            Add
          </button>
        </div>
      </form>

      {interns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-14 h-14 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No interns registered</p>
          <p className="text-sm text-gray-400 mt-1">Add your first intern above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Department</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map(i => (
                  <tr key={i._id} className="border-t border-gray-50 even:bg-gray-50/50 hover:bg-indigo-50/40 transition-colors">
                    <td className="p-3 font-medium text-gray-800">{i.name}</td>
                    <td className="p-3 text-gray-500">{i.email}</td>
                    <td className="p-3 text-gray-500">{i.department || '—'}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete(i._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-medium transition-colors">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
