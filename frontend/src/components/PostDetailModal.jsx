import React, { useState } from "react";
import "./PostDetailModal.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoShareSocial, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { PostsController } from "../controllers/PostsController";

const PostDetailModal = ({ post, comments, onClose, onCommentAdded, onLikeDec, onLikeInc }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes || 0);

  const [commentsAmount, setCommentsAmount] = useState(post.comments || false);

  const [showCommentInput, setCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    try {
      const response = await PostsController.handleLikePost(post.id);
      if (response.success) {
        setIsLiked(!isLiked);

        if (isLiked) {
          onLikeDec(post.id);
          setLikes(likes - 1);
        } else {
          onLikeInc(post.id);
          setLikes(likes + 1);
        }

      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  //implement case for users comments (user name to 'you')??
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await PostsController.handleCommentPost(post.id, newComment);
      if (response.success) {
        comments.push({
          id: response.commentId,
          user_id: "You",
          comment_text: newComment,
        });
        setNewComment("");
        setCommentInput(false);
        setCommentsAmount(commentsAmount+1)

        if (onCommentAdded) {
          onCommentAdded(post.id);
        }
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <button className="back" onClick={onClose}>
          <FaArrowLeft size={20} />
        </button>
        <button className="share">
          <IoShareSocial size={22} />
        </button>
      </div>

      <div className="modal-content">
        <div className="title-header">
          <div className="user-details">
            <div className="avatar">E</div>
            <p className="username">{post.user_id}</p>
          </div>
          <div className="title-container">
            <p className="post-title">Animal Spotted</p>
          </div>
        </div>

        <img className="post-image" src={post.image_url} alt={post.title} />

        <div className="map-section">
          <img
            className="map-image"
            src={require("../assets/Map-Demo.webp")}
            alt="Map view"
          />
          <div className="map-overlay">
            <FaLocationDot color="white" size={18} />
          </div>
        </div>

        <div className="engagement-date">
          <div className="engagement-stats">
            <div className="stat">
              <button className="icon" onClick={handleLike}>
                {isLiked ? (
                  <CiHeart
                    className="modal-heart filled"
                    size={32}
                    style={{ color: "red" }}
                  />
                ) : (
                  <CiHeart className="modal-heart" size={32} />
                )}
              </button>
              <span className="engament-amount">{likes}</span>
            </div>
            <div className="stat">
              <button
                className="icon"
                onClick={() => setCommentInput(!showCommentInput)}
              >
                <IoChatbubbleEllipsesOutline size={28} />
              </button>
              <span className="engament-amount">{commentsAmount}</span>
            </div>
          </div>
          <p className="date">{post.created_at}</p>
        </div>

        <div className="description-wrapper">
          <p className="description-username">{post.user_id}</p>
          <p className="description-text">{post.description}</p>
        </div>

        {showCommentInput && (
          <div className="comment-input-section">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleAddComment}>Done</button>
          </div>
        )}

        <hr className="commentsBreak" />
        <p className="comments-header">Other Comments:</p>
        <div className="comments-wrapper">
          {comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <p className="username">{comment.user_id}</p>
              <p className="description-text">{comment.comment_text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
