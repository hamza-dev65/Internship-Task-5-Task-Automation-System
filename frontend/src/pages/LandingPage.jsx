import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterns } from '../api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');

  useEffect(() => { getInterns().then(setInterns).catch(() => {}); }, []);

  const handleInternGo = () => {
    if (selectedIntern) navigate(`/intern/${selectedIntern}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Intern Task Manager</h1>
        <p className="text-gray-500 mb-8">Automated task assignment & progress tracking</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="bg-indigo-600 text-white rounded-xl p-6 hover:bg-indigo-700 transition shadow"
          >
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="text-lg font-semibold">Admin Panel</div>
            <div className="text-sm text-indigo-200 mt-1">Manage tasks & interns</div>
          </button>

          <div className="bg-purple-600 text-white rounded-xl p-6 hover:bg-purple-700 transition shadow">
            <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <div className="text-lg font-semibold">Intern Portal</div>
            <div className="text-sm text-purple-200 mt-1">View your tasks</div>
          </div>
        </div>

        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Select your name</label>
          <div className="flex gap-2">
            <select
              value={selectedIntern}
              onChange={e => setSelectedIntern(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Choose --</option>
              {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
            <button
              onClick={handleInternGo}
              disabled={!selectedIntern}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
