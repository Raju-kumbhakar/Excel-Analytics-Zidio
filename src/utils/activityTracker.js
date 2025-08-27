/**
 * Activity Tracker for Smart Maintenance Scheduling
 * Tracks user activity patterns to predict optimal maintenance windows
 */

class ActivityTracker {
  constructor() {
    this.storageKey = 'activity_logs';
    this.metricsKey = 'activity_metrics';
  }

  /**
   * Log user activity with timestamp
   * @param {string} action - Type of action (login, upload, chart_generation, etc.)
   * @param {string} userId - User identifier
   * @param {Object} metadata - Additional data
   */
  logActivity(action, userId = 'anonymous', metadata = {}) {
    try {
      const logs = this.getActivityLogs();
      const timestamp = Date.now();
      const hour = new Date(timestamp).getHours();
      const dayOfWeek = new Date(timestamp).getDay(); // 0 = Sunday, 6 = Saturday
      
      const logEntry = {
        id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        hour,
        dayOfWeek,
        action,
        userId,
        metadata
      };

      logs.push(logEntry);
      
      // Keep only last 30 days of logs
      const thirtyDaysAgo = timestamp - (30 * 24 * 60 * 60 * 1000);
      const filteredLogs = logs.filter(log => log.timestamp > thirtyDaysAgo);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredLogs));
      this.updateMetrics();
      
      return logEntry;
    } catch (error) {
      console.warn('Failed to log activity:', error);
      return null;
    }
  }

  /**
   * Get all activity logs
   * @returns {Array} Array of activity log entries
   */
  getActivityLogs() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Update activity metrics for analysis
   */
  updateMetrics() {
    const logs = this.getActivityLogs();
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Calculate hourly activity patterns
    const hourlyActivity = Array(24).fill(0);
    const dailyActivity = Array(7).fill(0);
    
    logs.forEach(log => {
      if (log.timestamp > oneWeekAgo) {
        hourlyActivity[log.hour]++;
        dailyActivity[log.dayOfWeek]++;
      }
    });

    // Calculate activity metrics
    const metrics = {
      totalActivities: logs.length,
      last24Hours: logs.filter(log => log.timestamp > oneDayAgo).length,
      last7Days: logs.filter(log => log.timestamp > oneWeekAgo).length,
      hourlyPattern: hourlyActivity,
      dailyPattern: dailyActivity,
      peakHour: hourlyActivity.indexOf(Math.max(...hourlyActivity)),
      lowActivityHour: hourlyActivity.indexOf(Math.min(...hourlyActivity)),
      lastUpdated: now
    };

    localStorage.setItem(this.metricsKey, JSON.stringify(metrics));
    return metrics;
  }

  /**
   * Get current activity metrics
   * @returns {Object} Activity metrics
   */
  getMetrics() {
    try {
      return JSON.parse(localStorage.getItem(this.metricsKey) || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Predict optimal maintenance windows
   * @param {number} durationHours - Maintenance duration in hours
   * @returns {Array} Recommended maintenance windows
   */
  predictOptimalWindows(durationHours = 2) {
    const metrics = this.getMetrics();
    if (!metrics.hourlyPattern) {
      return this.getDefaultWindows();
    }

    const { hourlyPattern, dailyPattern } = metrics;
    const recommendations = [];

    // Find consecutive low-activity hours
    for (let startHour = 0; startHour < 24; startHour++) {
      let totalActivity = 0;
      let validWindow = true;

      // Check if we have enough consecutive hours
      for (let i = 0; i < durationHours; i++) {
        const hour = (startHour + i) % 24;
        totalActivity += hourlyPattern[hour];
        
        // Skip if this would cross into high-activity periods
        if (hourlyPattern[hour] > Math.max(...hourlyPattern) * 0.3) {
          validWindow = false;
          break;
        }
      }

      if (validWindow) {
        recommendations.push({
          startHour,
          endHour: (startHour + durationHours) % 24,
          estimatedActivity: totalActivity,
          confidence: this.calculateConfidence(totalActivity, hourlyPattern),
          description: this.getTimeDescription(startHour, durationHours)
        });
      }
    }

    // Sort by lowest activity and highest confidence
    return recommendations
      .sort((a, b) => a.estimatedActivity - b.estimatedActivity || b.confidence - a.confidence)
      .slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Calculate confidence score for a maintenance window
   * @param {number} windowActivity - Activity in the proposed window
   * @param {Array} hourlyPattern - Overall hourly pattern
   * @returns {number} Confidence score (0-100)
   */
  calculateConfidence(windowActivity, hourlyPattern) {
    const totalActivity = hourlyPattern.reduce((sum, activity) => sum + activity, 0);
    const averageActivity = totalActivity / 24;
    
    if (averageActivity === 0) return 50; // No data, medium confidence
    
    const activityRatio = windowActivity / (averageActivity * 2); // 2-hour window
    return Math.max(0, Math.min(100, (1 - activityRatio) * 100));
  }

  /**
   * Get human-readable time description
   * @param {number} startHour - Start hour (0-23)
   * @param {number} duration - Duration in hours
   * @returns {string} Time description
   */
  getTimeDescription(startHour, duration) {
    const endHour = (startHour + duration) % 24;
    const formatHour = (hour) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:00 ${period}`;
    };

    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  }

  /**
   * Get default maintenance windows when no data is available
   * @returns {Array} Default maintenance windows
   */
  getDefaultWindows() {
    return [
      {
        startHour: 2,
        endHour: 4,
        estimatedActivity: 0,
        confidence: 70,
        description: '2:00 AM - 4:00 AM (Default low-activity period)'
      },
      {
        startHour: 3,
        endHour: 5,
        estimatedActivity: 0,
        confidence: 65,
        description: '3:00 AM - 5:00 AM (Default low-activity period)'
      },
      {
        startHour: 1,
        endHour: 3,
        estimatedActivity: 0,
        confidence: 60,
        description: '1:00 AM - 3:00 AM (Default low-activity period)'
      }
    ];
  }

  /**
   * Get activity heatmap data for visualization
   * @returns {Object} Heatmap data
   */
  getHeatmapData() {
    const metrics = this.getMetrics();
    if (!metrics.hourlyPattern) return null;

    const { hourlyPattern, dailyPattern } = metrics;
    const maxHourly = Math.max(...hourlyPattern);
    const maxDaily = Math.max(...dailyPattern);

    return {
      hourly: hourlyPattern.map((activity, hour) => ({
        hour,
        activity,
        intensity: maxHourly > 0 ? (activity / maxHourly) * 100 : 0,
        label: `${hour}:00`
      })),
      daily: dailyPattern.map((activity, day) => ({
        day,
        activity,
        intensity: maxDaily > 0 ? (activity / maxDaily) * 100 : 0,
        label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
      }))
    };
  }

  /**
   * Clear all activity data (for testing/reset)
   */
  clearData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.metricsKey);
  }
}

// Create singleton instance
const activityTracker = new ActivityTracker();

export default activityTracker;
