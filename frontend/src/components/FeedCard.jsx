import React from 'react';
import './FeedCard.css';
import { FaLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { PostsController } from "../controllers/PostsController";

const FeedCard = ({ entry, setSelectedPost, setPostDetailVisible }) => {
  const handleCardClick = async () => {
    try {
      const response = await PostsController.handleFetchPost(entry.id);
      if (response.success) {
        setSelectedPost(response.post); // this post should include comments
        setPostDetailVisible(true);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  return (
    <div className="feed-card" onClick={handleCardClick}>
      <div className="feed-card-header">
        <img
          src={entry.userAvatar || require('../assets/Jean-Steyn-ProfilePic.webp')}
          alt={`${entry.user}'s avatar`}
          className="avatar"
        />
        <span className="username">{entry.user_id}</span>
      </div>
      {/*insert alt={entry.title} if needed*/}
      <img src={entry.image_url} alt={entry.title} className="feed-card-image" />

      <div className="feed-card-body">
        <p className="feed-card-description">
          <strong>{entry.user_id}</strong> {entry.description}
        </p>
        <div className="engagement">
          {/*add logic for is post liked by user*/}
          <span className="likes"><CiHeart className="heart" size={23}/> {entry.likes}</span>
          <span className="comments"><IoChatbubbleEllipsesOutline className="bubble" size={20}/> 0</span>
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
