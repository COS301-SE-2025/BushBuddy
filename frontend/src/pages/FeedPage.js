import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedPage.css';
import FeedFilters from '../components/FeedFilters.jsx';
import FeedCard from '../components/FeedCard.jsx';
import { PostsController } from '../controllers/PostsController';
import PostDetailModal from '../components/PostDetailModal';

const FeedPage = () => {
	const navigate = useNavigate();
	const [posts, setPosts] = useState([]);
	const [selectedPost, setSelectedPost] = useState(null);
	const [postDetailVisible, setPostDetailVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('All');

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const response = await PostsController.handleFetchAllPosts(filter);
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
	}, [filter, selectedPost]);

	useEffect(() => {
		if (postDetailVisible) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [selectedPost]);

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

	const handleFilterChange = (newFilter) => {
		setFilter(newFilter); // Update filter state
	};

	return (
		<div className="feed-page">
			<FeedFilters onFilterChange={handleFilterChange} />
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
							onClose={() => {
								setSelectedPost(null);
							}} //temporary fix for modal not updating likes
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
