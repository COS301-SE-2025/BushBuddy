import React from 'react';
import './ActivityStatsCard.css';

const ActivityStatsCard = () => {
  return (
    <div className="activity-stats-card">
      <h4 className="activity-stats-title">Activity Statistics</h4>
      <div className="activity-stats-row">
        <div className="activity-stats-item">
          <div className="activity-stats-value">87</div>
          <div className="activity-stats-label">Detections</div>
        </div>
        <div className="activity-stats-divider"></div>
        <div className="activity-stats-item">
          <div className="activity-stats-value">42</div>
          <div className="activity-stats-label">Contributions</div>
        </div>
        <div className="activity-stats-divider"></div>
        <div className="activity-stats-item">
          <div className="activity-stats-value">94%</div>
          <div className="activity-stats-label">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStatsCard;
