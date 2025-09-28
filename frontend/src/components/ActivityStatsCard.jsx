import React, { useEffect, useState } from 'react';
import './ActivityStatsCard.css';
import { SightingsController } from "../controllers/SightingsController";
import { PostsController } from "../controllers/PostsController";

const ActivityStatsCard = () => {
  const [loading, setLoading] = useState(false);
  const [postingsAmount, setPostingsAmount] = useState(null);
  const [sightingsAmount, setSightingsAmount] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const postsResponse = await PostsController.handleFetchUserPostsAmount();
        if (postsResponse.success) {
          setPostingsAmount(postsResponse.amountOfPosts);
        } else {
          console.error(postsResponse.message);
        }

        const sightingsResponse = await SightingsController.handleFetchUserSightingsAmount();
        if (sightingsResponse.success) {
          setSightingsAmount(sightingsResponse.amountOfSightings);
        } else {
          console.error(sightingsResponse.message);
        }
      } catch (err) {
        console.error("Error fetching posts amount:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="activity-stats-card">
      {loading ? (
        <div className="stats-loader-wrapper">
          <div className="stats-loader"></div>
        </div>
      ):(
        <>
          <h4 className="activity-stats-title">Activity Statistics</h4>
          <div className="activity-stats-row">
            <div className="activity-stats-item">
              <div className="activity-stats-value">{sightingsAmount}</div>
              <div className="activity-stats-label">Sightings</div>
            </div>
            <div className="activity-stats-divider"></div>
            <div className="activity-stats-item">
              <div className="activity-stats-value">{postingsAmount}</div>
              <div className="activity-stats-label">Posts</div>
            </div>
            {/* <div className="activity-stats-divider"></div>
            <div className="activity-stats-item">
              <div className="activity-stats-value">94%</div>
              <div className="activity-stats-label">Accuracy</div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityStatsCard;
