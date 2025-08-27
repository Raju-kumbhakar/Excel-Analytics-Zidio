import React from 'react';

const About = () => {
  return (
    <div className="min-h-[60vh] w-full px-4 sm:px-8 lg:px-12 py-12 relative z-10">
      <div className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-4">About Us</h1>
        <p className="text-gray-300 leading-relaxed">
          Excel Analytics helps you transform spreadsheets into actionable insights.
          Upload, map, and visualize your Excel data in seconds with beautiful, exportable charts.
        </p>
      </div>
    </div>
  );
};

export default About;
