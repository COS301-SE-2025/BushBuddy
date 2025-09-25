import React, { useState } from "react";
import "./FeedCard.css";
import { FaLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { PostsController } from "../controllers/PostsController";

const FeedCard = ({ entry, setSelectedPost, setPostDetailVisible }) => {
  const [isLiked, setIsLiked] = useState(entry.isLiked || false);
  const [likes, setLikes] = useState(entry.likes || 0);

  const handleCardClick = async () => {
    try {
      const response = await PostsController.handleFetchPost(entry.id);
      if (response.success) {
        setSelectedPost(response.post, likes);
        setPostDetailVisible(true);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await PostsController.handleLikePost(entry.id);
      if (response.success) {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="feed-card" onClick={handleCardClick}>
      <div className="feed-card-header">
        <img
          src={entry.userAvatar || require("../assets/Jean-Steyn-ProfilePic.webp")}
          alt={`${entry.user}'s avatar`}
          className="avatar"
        />
        <span className="username">{entry.user_id}</span>
      </div>

      <img src={entry.image_url} alt={entry.title} className="feed-card-image" />

      <div className="feed-card-body">
        <p className="feed-card-description">
          <strong>{entry.user_id}</strong> {entry.description}
        </p>
        <div className="engagement">
          <span className="likes" onClick={handleLike}>
            {isLiked ? (
              <CiHeart className="heart filled" size={23} style={{ color: "red" }} />
            ) : (
              <CiHeart className="heart" size={23} />
            )}
            {likes} {/*entry.likes for gloabl state consistency*/}
          </span>
          <span className="comments">
            <IoChatbubbleEllipsesOutline className="bubble" size={20} />
            {entry.comments}
          </span>
        </div>
        <div className="feed-card-footer">
          <span className="timestamp">{entry.created_at}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
