import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedPage.css';
import SearchBar from '../components/SearchBar.jsx';
import FeedFilters from '../components/FeedFilters.jsx';
import FeedCard from '../components/FeedCard.jsx';

const FeedPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const animalFilters = [
      { type: 'all', icon: 'pets', color: '#FF6B35' },
      { type: 'elephant', icon: 'pets', color: '#4CAF50' },
      { type: 'lion', icon: 'warning', color: '#FF9800' },
      { type: 'rhino', icon: 'track-changes', color: '#2196F3' },
      { type: 'antelope', icon: 'nature', color: '#9C27B0' },
      { type: 'bird', icon: 'flight', color: '#00BCD4' }
    ];
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState('all');

  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetailVisible, setPostDetailVisible] = useState(false);

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

  return( 
    <div className="feed-page">
      <SearchBar />
      <FeedFilters />

      {feedEntries.map(entry => (
        <FeedCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default FeedPage;