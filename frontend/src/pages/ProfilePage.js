import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ActivityStatsCard from '../components/ActivityStatsCard.jsx';
import AchievementsCard from '../components/AchievementsCard.jsx';
import SettingsSection from '../components/SettingsSection';
import FeedCard from '../components/FeedCard.jsx';
import { PostsController } from '../controllers/PostsController';
import PostDetailModal from '../components/PostDetailModal';

const ProfilePage = () => {
	const navigate = useNavigate();
	const [activeMode, setActiveMode] = useState('POSTS');
	const [loading, setLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [postToDelete, setPostToDelete] = useState(null);
	const [posts, setPosts] = useState([]);
	const [selectedPost, setSelectedPost] = useState(null);
	const [postDetailVisible, setPostDetailVisible] = useState(false);
	const [showDeleteConfirmation, setDeleteConfirmation] = useState(false);

	const [showPopup, setShowPopup] = useState(false);
	const [popUpText, setPopupText] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const response = await PostsController.handleFetchUsersPosts();
				if (response.success) {
					setPosts(response.posts);
				} else {
					console.error(response.message);
				}
			} catch (err) {
				console.error('Error fetching posts:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	const handleIncrementComments = (postId) => {
		setPosts((prevPosts) => prevPosts.map((p) => (p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p)));
	};

	const handleDecLikes = (postId) => {
		console.log('Decreasing likes for post ID:', postId);
		setPosts((prevPosts) =>
			prevPosts.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) - 1, isLiked: false } : p))
		);
	};

	const handleIncLikes = (postId) => {
		setPosts((prevPosts) =>
			prevPosts.map((p) => (p.id === postId ? { ...p, likes: (p.likes || 0) + 1, isLiked: true } : p))
		);
	};

	const handleDelete = async () => {
		setDeleteLoading(true);
		setDeleteConfirmation(false);
		const result = await PostsController.handleDeletePost(postToDelete);
		setDeleteLoading(false);

		if (result.success) {
			setPopupText('Post deleted successfully');
			setShowPopup(true);
			setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postToDelete));
			setPostToDelete(null);
		} else {
			setPopupText('Failed to delete post');
			setShowPopup(true);
		}
	};

	const handleCloseDelete = async () => {
		setDeleteConfirmation(false);
		setPostToDelete(null);
	};

	/* const handleLogout = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || '';
      
      // Use relative URLs that work in both development and production (important because it worked just on localhost)
      const possibleUrls = [
        `${baseUrl}/api/auth/logout`,
        `${baseUrl}/auth/logout`, 
        `${baseUrl}/logout`
      ];

      let response;
      let lastError;

      // Try each URL until one works
      for (const url of possibleUrls) {
        try {
          console.log('Trying logout URL:', url);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (response.ok) {
            console.log('Logout request successful with URL:', url);
            break;
          } else {
            console.log(`URL ${url} returned status:`, response.status);
          }
        } catch (err) {
          console.log(`URL ${url} failed:`, err.message);
          lastError = err;
          continue;
        }
      }

      if (!response || !response.ok) {
        console.error(`All logout URLs failed. Last error: ${lastError?.message || 'Unknown error'}`);
      }

      // Always logout on frontend regardless of server response
      console.log('Logging out user and redirecting...');
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');

    } catch (error) {
      console.error('Error during logout:', error);
      
      // Always logout on frontend even if server call fails
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  }; */
	const handleLogout = async () => {
		try {
			const result = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if (result.ok) {
				window.sessionStorage.clear();
				window.dispatchEvent(new Event('profileCleared'));
				navigate('/login');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="profile-page">
			<div className="profile-nav">
				<span
					className={`profile-nav-buttons ${activeMode === 'POSTS' ? 'active' : ''}`}
					onClick={() => setActiveMode('POSTS')}>
					MY POSTS
				</span>
				<span
					className={`profile-nav-buttons ${activeMode === 'ACHIEVEMENTS' ? 'active' : ''}`}
					onClick={() => setActiveMode('ACHIEVEMENTS')}>
					ACHIEVEMENTS
				</span>
				<span
					className={`profile-nav-buttons ${activeMode === 'PROFILE' ? 'active' : ''}`}
					onClick={() => setActiveMode('PROFILE')}>
					PROFILE
				</span>
			</div>

			{activeMode === 'POSTS' ? (
				<>
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
									setDeleteConfirmation={setDeleteConfirmation}
									setPostToDelete={setPostToDelete}
								/>
							))}

							{postDetailVisible && selectedPost && (
								<PostDetailModal
									post={selectedPost.data.post}
									comments={selectedPost.data.comments}
									onClose={() => {
										window.location.reload();
									}} //temporary fix for modal not updating likes
									onCommentAdded={handleIncrementComments}
									onLikeDec={handleDecLikes}
									onLikeInc={handleIncLikes}
								/>
							)}
						</>
					)}
				</>
			) : activeMode === 'ACHIEVEMENTS' ? (
				<>
					<p>achievements</p>
					{/*<ActivityStatsCard />
            <AchievementsCard />*/}
				</>
			) : (
				<>
					<ProfileHeader />
					<SettingsSection onLogout={handleLogout} />
				</>
			)}

			{loading && (
				<div className="loader-wrapper">
					<div className="loader"></div>
				</div>
			)}

			{showDeleteConfirmation && (
				<div className="form-overlay">
					<div className="success-popup">
						<h4>Are you sure you want to delete this post?</h4>
						<button className="yes-button" onClick={() => handleDelete()}>
							YES
						</button>
						<button className="no-button" onClick={() => handleCloseDelete()}>
							NO
						</button>
					</div>
				</div>
			)}

			{showPopup && (
				<div className="form-overlay">
					<div className="success-popup">
						<h4>{popUpText}</h4>
						<button className="submit-button" onClick={() => setShowPopup(false)}>
							OK
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
