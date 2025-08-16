import React from 'react';
import './FeedCard.css';
import { FaLocationArrow } from "react-icons/fa";

const FeedCard = ({ entry }) => {
  return (
    <div className="feed-card">
      <div className="feed-card-header">
        {/*insert user avatar for src={entry.userAvatar}*/}
        <img src={require('../assets/Jean-Steyn-ProfilePic.webp')} alt={`${entry.user}'s avatar`} className="avatar" />
        <span className="username">{entry.user_id}</span>
      </div>
      {/*insert alt={entry.title} if needed*/}
      <img src={entry.image_url} alt={entry.title} className="feed-card-image" />

      <div className="feed-card-body">
        <p className="description"><strong>{entry.user_id}</strong> {entry.description}</p>
        <div className="engagement">
          <span className="likes">❤️ {entry.likes}</span>
          <span className="comments">💬 {entry.comments}</span>
        </div>
        <div className="feed-card-footer">
        <span className="timestamp">{entry.created_at}</span>
        {/*<span className="location"><FaLocationArrow />{entry.location}</span>*/}
      </div>
      </div>
    </div>
  );
};

export default FeedCard;
