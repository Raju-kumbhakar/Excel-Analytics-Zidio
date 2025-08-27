import React, { useState } from 'react';

const Feedback = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('feedback');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({
      title,
      desc,
      type,
      date: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem('user'))?.email || 'Anonymous',
      from: 'FeedbackPage'
    });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    setSubmitted(true);
    setTitle(''); setDesc(''); setType('feedback');
  };

  return (
    <div className="min-h-[60vh] w-full px-4 sm:px-8 lg:px-12 py-12 relative z-10">
      <div className="max-w-2xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-4">Feedback</h1>
        <p className="text-gray-300 mb-6">Share bugs, ideas, or general feedback. We read everything.</p>
        {submitted && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-600/20 border border-green-500/40 text-green-200">
            ✅ Thanks for your feedback!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Type</label>
            <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg">
              <option value="feedback">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Title</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Description</label>
            <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg h-28" required />
          </div>
          <button className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
