import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedPage.css";
import FeedFilters from "../components/FeedFilters.jsx";
import FeedCard from "../components/FeedCard.jsx";
import { PostsController } from "../controllers/PostsController";
import PostDetailModal from "../components/PostDetailModal";

const FeedPage = () => {
  const navigate = useNavigate();
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

  const handleIncrementComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
      )
    );
  };

  const handleDecLikes = (postId) => {
    console.log("Decreasing likes for post ID:", postId);
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, likes: (p.likes || 0) - 1, isLiked: false } : p
      )
    );
  };

  const handleIncLikes = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, likes: (p.likes || 0) + 1, isLiked: true } : p
      )
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

          {postDetailVisible && selectedPost && (
            <PostDetailModal
              post={selectedPost.data.post}
              comments={selectedPost.data.comments}
              onClose={() => {window.location.reload()}} //temporary fix for modal not updating likes
              onCommentAdded={handleIncrementComments}
              onLikeDec={handleDecLikes}
              onLikeInc={handleIncLikes}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FeedPage;
