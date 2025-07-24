import React from 'react';
import './FeedCard.css';

const FeedCard = ({ entry }) => {
  return (
    <div className="feed-card">
      <div className="feed-card-header">
        <img src={entry.userAvatar} alt={`${entry.user}'s avatar`} className="avatar" />
        <span className="username">{entry.user}</span>
      </div>

      <img src={entry.image} alt={entry.title} className="feed-card-image" />

      <div className="feed-card-body">
        <p className="description"><strong>{entry.user}</strong> {entry.description}</p>
        <div className="engagement">
          <span className="likes">❤️ {entry.likes}</span>
          <span className="comments">💬 {entry.comments}</span>
        </div>
        <div className="feed-card-footer">
        <span className="timestamp">{entry.timestamp}</span>
        <span className="location">{entry.location}</span>
      </div>
      </div>
    </div>
  );
};

export default FeedCard;
