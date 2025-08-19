import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedPage.css';
import SearchBar from '../components/SearchBar.jsx';
import FeedFilters from '../components/FeedFilters.jsx';
import FeedCard from '../components/FeedCard.jsx';
import { PostsController } from '../controllers/PostsController';

import { FaArrowLeft } from "react-icons/fa";
import { IoShareSocial, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";

const FeedPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState('all');
  const [posts, setPosts] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailVisible, setPostDetailVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await PostsController.handleFetchAllPosts();
        if (response.success) {
          setPosts(response.posts);
        } else {
          console.error(response.message);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderPostDetailModal = () => {
    if (!selectedPost) return null;

    const postData = selectedPost.data.post;
    const postComments = selectedPost.data.comments;

    return (
      <div className="modal">
        <div className="modal-header">
          <button className="back" onClick={() => setPostDetailVisible(false)}>
            <FaArrowLeft size={20}/>
          </button>
          {/* change settings to drop down for share? */}
          <button className="share">
            <IoShareSocial size={22}/>
          </button>
        </div>

        <div className="modal-content">
          <div className="title-header">
            {/* User Info Section */}
            <div className="user-details">
            {/* add logic for user avatar? */}
              <div className="avatar">E</div>
              <p className="username">{postData.user_id}</p>
            </div>
            <div className="title-container">
              {/* add logic for post title? */}
              <p className='post-title'>Animal Spotted</p>
            </div>
          </div>
          {/* Main Image */}
          <img className="modal-image" src={postData.image_url} alt={postData.title} />

          <br/>

          {/* Map Section */}
          <div className="map-section">
            <img className="map-image" src={require('../assets/Map-Demo.webp')} alt="Map view" />
            <div className="map-overlay">
              <FaLocationDot color='white' size={18}/>
            </div>
          </div>

          <div className="engagement-date">
            {/* Engagement Stats */}
            <div className="engagement-stats">
              <div className="stat">
                <button className="icon">
                {/*add logic for - is post liked by user*/}
                  <CiHeart size={32}/>
                </button>
                <span className="engament-amount">
                  {postData.likes}
                </span>
              </div>
              <div className="stat">
                <button className="icon">
                  {/*add logic for amount of comments and show comments*/}
                  <IoChatbubbleEllipsesOutline size={28}/>
                </button>
                <span className="engament-amount">
                  {postData.likes}
                </span>
              </div>
            </div>
            {/* Timestamp */}
            <p className="date">{postData.created_at}</p>
          </div>

          {/* Description */}
          <div className="description-wrapper">
            <p className="username">{postData.user_id}</p>
            <p className="description">{postData.description}</p>
          </div>
          <hr className="commentsBreak"/>
          {/* comments */}
          <p className= "comments-header">Other Comments:</p>
          <div className="comments-wrapper">
            {postComments.map((comment)=>(
              <div className="comment" key={comment.id}>
                <p className="username">{comment.user_id}</p>
                <p className="description">{comment.comment_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="feed-page">
      <FeedFilters />
      {loading ? (
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {posts.map((entry) => (
            <FeedCard
              key={entry.id}
              entry={entry}
              setSelectedPost={setSelectedPost}
              setPostDetailVisible={setPostDetailVisible}
            />
          ))}
          {postDetailVisible && renderPostDetailModal()}
        </>
      )}
    </div>
  );
};

export default FeedPage;