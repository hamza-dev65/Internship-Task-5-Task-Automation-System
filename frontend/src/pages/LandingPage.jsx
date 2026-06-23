import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterns } from '../api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [showInternSelector, setShowInternSelector] = useState(false);

  useEffect(() => { getInterns().then(setInterns).catch(() => {}); }, []);

  const handleInternGo = () => {
    if (selectedIntern) navigate(`/intern/${selectedIntern}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 w-full max-w-lg text-center animate-fadeIn">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Intern Task Manager</h1>
        <p className="text-sm text-gray-400 tracking-wide mb-8">Automated task assignment &amp; progress tracking</p>

        {!showInternSelector ? (
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              onClick={() => navigate('/admin')}
              className="group bg-white text-gray-800 rounded-xl p-6 border-2 border-indigo-100 hover:border-indigo-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-gray-800">Admin Panel</div>
              <div className="text-xs text-gray-400 mt-1">Manage tasks &amp; interns</div>
            </button>

            <button
              onClick={() => setShowInternSelector(true)}
              className="group bg-white text-gray-800 rounded-xl p-6 border-2 border-purple-100 hover:border-purple-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-base font-semibold text-gray-800">Intern Portal</div>
              <div className="text-xs text-gray-400 mt-1">View your tasks</div>
            </button>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Intern Portal</h2>
            <p className="text-sm text-gray-400 mb-6">Select your name to continue</p>

            <label className="block text-xs font-medium text-gray-600 mb-1.5 text-left">Your name</label>
            <div className="flex gap-2">
              <select
                value={selectedIntern}
                onChange={e => setSelectedIntern(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 focus:outline-none transition-all"
              >
                <option value="">-- Choose --</option>
                {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
              </select>
              <button
                onClick={handleInternGo}
                disabled={!selectedIntern}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Go
              </button>
            </div>
            <button
              onClick={() => { setShowInternSelector(false); setSelectedIntern(''); }}
              className="mt-5 text-sm text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to role selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
