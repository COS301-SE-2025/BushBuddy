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

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await PostsController.handleFetchAllPosts();
      if (response.success) {
        setPosts(response.posts);
      } else {
        console.error(response.message);
      }
    };

    fetchPosts();
  }, []);
    
  const feedEntries = [
    { 
      id: '1',
      type: 'elephant',
      title: 'Elephant Bull Spotted',
      user: 'Ruan',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.webp'), // Placeholder holder fix later Jean
      location: 'Kruger National Park',
      timestamp: '21/05/2025 8:45',
      image: require('../assets/Elephant.webp'),
      mapImage: require('../assets/Map-Demo.webp'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'I spotted this large Elephant bull near Bateleur road this morning while on a game drive',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    { 
      id: '2',
      type: 'lion',
      title: 'Pride of Lions',
      user: 'Ruben',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.webp'), // Placeholder holder fix later Jean
      location: 'Mabula Nature Reserve',
      timestamp: '20/05/2025 17:45',
      image: require('../assets/Pride-Lions-Demo.webp'),
      mapImage: require('../assets/Map-Demo.webp'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'Amazing pride of lions spotted resting under acacia trees. The cubs were playing while the adults kept watch.',
      likes: 18,
      comments: 5,
      isLiked: true
    },
    { 
      id: '3',
      type: 'rhino',
      title: 'White Rhinos Spotted',
      user: 'Raffie',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.webp'), // Placeholder holder fix later Jean
      location: 'Dinokeng',
      timestamp: '21/05/2025 8:45',
      image: require('../assets/rhino-group.webp'),
      mapImage: require('../assets/Map-Demo.webp'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'Two magnificent white rhinos grazing peacefully in the early morning light. Such incredible creatures!',
      likes: 31,
      comments: 12,
      isLiked: false
    },
    { 
      id: '4',
      type: 'antelope',
      title: 'Eland Spotted',
      user: 'Tom',
      userAvatar: require('../assets/Jean-Steyn-ProfilePic.webp'), // Placeholder holder fix later Jean
      location: 'Rietvlei Nature Reserve',
      timestamp: '21/05/2025 8:45',
      image: require('../assets/Eland.webp'),
      mapImage: require('../assets/Map-Demo.webp'), // Map view demo image.The same image is used for all entries because of the demo
      description: 'Beautiful herd of eland antelope spotted during sunset. They were so graceful moving across the grassland.',
      likes: 15,
      comments: 3,
      isLiked: false
    },
  ];

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
      <SearchBar />
      <FeedFilters />
      {posts.map((entry) => (
        <FeedCard
          key={entry.id}
          entry={entry}
          setSelectedPost={setSelectedPost}
          setPostDetailVisible={setPostDetailVisible}
        />
      ))}
      {postDetailVisible && renderPostDetailModal()}
    </div>
  );
};

export default FeedPage;