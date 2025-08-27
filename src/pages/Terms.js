import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-[60vh] w-full px-4 sm:px-8 lg:px-12 py-12 relative z-10">
      <div className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-4">Terms & Conditions</h1>
        <p className="text-gray-300 leading-relaxed mb-2">
          By using Excel Analytics, you agree to our standard terms of service. This demo content is for placeholder purposes.
        </p>
        <ul className="list-disc ml-5 text-gray-300 space-y-1">
          <li>Use the service responsibly.</li>
          <li>Respect privacy and data security.</li>
          <li>No abuse, spam, or illegal content.</li>
        </ul>
      </div>
    </div>
  );
};

export default Terms;
