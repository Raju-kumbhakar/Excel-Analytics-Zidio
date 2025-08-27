import React, { useState, useEffect } from 'react';
import activityTracker from '../utils/activityTracker';

const SmartScheduling = ({ onScheduleMaintenace }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [duration, setDuration] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
    loadHeatmapData();
  }, [duration]);

  const loadRecommendations = () => {
    setLoading(true);
    try {
      const windows = activityTracker.predictOptimalWindows(duration);
      setRecommendations(windows);
    } catch (error) {
      console.warn('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHeatmapData = () => {
    try {
      const data = activityTracker.getHeatmapData();
      setHeatmapData(data);
    } catch (error) {
      console.warn('Failed to load heatmap data:', error);
    }
  };

  const handleSchedule = (window) => {
    if (onScheduleMaintenace) {
      // Calculate the next occurrence of this time window
      const now = new Date();
      const nextWindow = new Date();
      nextWindow.setHours(window.startHour, 0, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (nextWindow <= now) {
        nextWindow.setDate(nextWindow.getDate() + 1);
      }

      onScheduleMaintenace(nextWindow, duration);
    }
  };

  const getIntensityColor = (intensity) => {
    if (intensity < 20) return 'bg-green-500/20 border-green-500/40';
    if (intensity < 50) return 'bg-yellow-500/20 border-yellow-500/40';
    if (intensity < 80) return 'bg-orange-500/20 border-orange-500/40';
    return 'bg-red-500/20 border-red-500/40';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Smart Maintenance Scheduling</h3>
          <p className="text-gray-300 text-sm">AI-powered optimal maintenance windows based on user activity patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300">Duration (hours):</label>
          <input
            type="number"
            min="1"
            max="8"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-20 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white"
          />
        </div>
      </div>

      {/* Activity Heatmap */}
      {heatmapData && (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Activity Heatmap (Last 7 Days)</h4>
          
          {/* Hourly Activity */}
          <div className="mb-6">
            <div className="text-sm text-gray-300 mb-2">Hourly Activity Pattern</div>
            <div className="grid grid-cols-12 gap-1">
              {heatmapData.hourly.map((hour) => (
                <div
                  key={hour.hour}
                  className={`h-8 rounded border ${getIntensityColor(hour.intensity)} flex items-center justify-center text-xs font-medium`}
                  title={`${hour.label}: ${hour.activity} activities`}
                >
                  {hour.hour}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Activity */}
          <div>
            <div className="text-sm text-gray-300 mb-2">Daily Activity Pattern</div>
            <div className="grid grid-cols-7 gap-2">
              {heatmapData.daily.map((day) => (
                <div
                  key={day.day}
                  className={`h-12 rounded border ${getIntensityColor(day.intensity)} flex items-center justify-center text-sm font-medium`}
                  title={`${day.label}: ${day.activity} activities`}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/40"></div>
              <span>Low Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/40"></div>
              <span>Medium Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40"></div>
              <span>High Activity</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Recommended Maintenance Windows</h4>
          <button
            onClick={loadRecommendations}
            disabled={loading}
            className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20 disabled:opacity-50"
          >
            {loading ? '🔄' : '↻'} Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-300">
            <div className="animate-spin text-2xl mb-2">⚙️</div>
            Analyzing activity patterns...
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((window, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedWindow === index
                    ? 'bg-blue-500/20 border-blue-500/60'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setSelectedWindow(selectedWindow === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">{window.description}</div>
                    <div className="text-sm text-gray-300 mt-1">
                      Expected activity: {window.estimatedActivity} events
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getConfidenceColor(window.confidence)}`}>
                      {Math.round(window.confidence)}% confidence
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchedule(window);
                      }}
                      className="mt-2 px-4 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm font-medium hover:from-emerald-700 hover:to-blue-700"
                    >
                      Schedule Now
                    </button>
                  </div>
                </div>
                
                {selectedWindow === index && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-sm text-gray-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Start Time:</strong> {window.startHour}:00
                      </div>
                      <div>
                        <strong>End Time:</strong> {window.endHour}:00
                      </div>
                      <div>
                        <strong>Duration:</strong> {duration} hours
                      </div>
                      <div>
                        <strong>Impact:</strong> {window.estimatedActivity < 5 ? 'Minimal' : window.estimatedActivity < 15 ? 'Low' : 'Medium'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-300">
            <div className="text-2xl mb-2">📊</div>
            <div>No activity data available yet.</div>
            <div className="text-sm mt-1">Use the system for a few days to generate recommendations.</div>
          </div>
        )}
      </div>

      {/* Manual Override */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Manual Scheduling</h4>
        <div className="text-sm text-gray-300 mb-4">
          If you need to schedule maintenance outside of recommended windows, you can still use the manual controls in the System Settings section.
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Smart scheduling considers user activity patterns, system load, and historical data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartScheduling;
