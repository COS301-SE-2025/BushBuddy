import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./FeedCard.css";
import { FaLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PostsController } from "../controllers/PostsController";

const FeedCard = ({ entry, setSelectedPost, setPostDetailVisible, setDeleteConfirmation, setPostToDelete }) => {
  const location = useLocation();
  const path = location.pathname;

  const [isLiked, setIsLiked] = useState(entry.isLiked || false);
  const [likes, setLikes] = useState(entry.likes || 0);

  const [showDeleteButton, setShowDeleteButton] = useState(false);

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

  const handleDeleteClick = async (postId) => {
    setPostToDelete(postId);
    setDeleteConfirmation(true);
  }

  useEffect(() => {
    // Hide the nav bar on specific routes
    const hideNavBarRoutes = ['/profile'];
    setShowDeleteButton(hideNavBarRoutes.includes(path));
  }, [path]);

  return (
    <div className="feed-card">
      <div className="feed-card-header">
        {/* <img
          src={entry.userAvatar || require("../assets/Jean-Steyn-ProfilePic.webp")}
          alt={`${entry.user}'s avatar`}
          className="avatar"
        /> */}
        <div className="avatar">{entry.user_id[0].toUpperCase()}</div>
        <span className="username">{entry.user_id}</span>
        {showDeleteButton ? (
          <div className="delete-div" onClick={() => handleDeleteClick(entry.id)}>
            <button className="delete-button" >
              <RiDeleteBin5Line />
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>

      <img src={entry.image_url} alt={entry.title} className="feed-card-image" onClick={handleCardClick}/>

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
