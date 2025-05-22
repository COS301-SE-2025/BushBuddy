import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const MainScreen = ({ route }) => {
  // Use the navigation hook instead of prop
  const navigation = useNavigation();
  
  // Safely access route params with default values if they don't exist
  const params = route?.params || {};
  const username = params.username || 'Jean Steyn';
  
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [bestiaryFilter, setBestiaryFilter] = useState('All');

  // Navigate to MapScreen
  const handleMapNavigation = () => {
    console.log('Navigating to MapScreen...');
    navigation.navigate('MapScreen');
    setActiveTab('map');
  };

  // Navigate to FeedScreen
  const handleFeedNavigation = () => {
    console.log('Navigating to FeedScreen...');
    navigation.navigate('FeedScreen');
    setActiveTab('feed');
  };

  // Handle camera action - modified to work without expo-camera
  const handleCameraAction = () => {
    // For now, just show a placeholder screen that simulates the camera
    setCameraVisible(true);
    console.log('Camera would open here if expo-camera was installed');
  };

  // Simulate taking a photo
  const takePicture = () => {
    Alert.alert(
      'Photo Captured',
      'Wildlife detection in progress... (This is a simulation, install expo-camera for full functionality)',
      [{ text: 'OK', onPress: () => setCameraVisible(false) }]
    );
  };

  // Exit camera mode
  const handleCloseCamera = () => {
    setCameraVisible(false);
  };

  // Sample data for wildlife detection history
  const recentEntries = [
    { id: '1', title: 'Elephant Detection', date: '2025-05-19', type: 'elephant', location: 'Sector A4' },
    { id: '2', title: 'Lion Sighting', date: '2025-05-19', type: 'lion', location: 'Sector B2' },
    { id: '3', title: 'Rhino Tracking', date: '2025-05-18', type: 'rhino', location: 'Sector C7' },
  ];

  // Bestiary data
  const bestiaryData = [
  {
    id: '1',
    name: 'Eland',
    scientificName: 'Taurotragus oryx',
    status: 'Least Concern',
    category: 'Antelope',
    image: '/api/placeholder/150/120',
    description: 'The largest antelope in Africa',
    facts: ['Can jump 8 feet high', 'Weighs up to 940 kg', 'Lives in herds']
  },  // Fixed comma added here
  {
    id: '2',
    name: 'Rhino',
    scientificName: 'Ceratotherium simum',
    status: 'Near Threatened',
    category: 'Mammal',
    image: '/api/placeholder/150/120',
    description: 'Large herbivorous mammal',
    facts: ['Can weigh up to 2,300 kg', 'Horn made of keratin', 'Excellent hearing']
  },
  {
    id: '3',
    name: 'Buffalo',
    scientificName: 'Syncerus caffer',
    status: 'Least Concern',
    category: 'Mammal',
    image: '/api/placeholder/150/120',
    description: 'African buffalo or Cape buffalo',
    facts: ['Live in herds of 50-500', 'Excellent memory', 'Can weigh 900 kg']
  },
  {
    id: '4',
    name: 'Elephant',
    scientificName: 'Loxodonta africana',
    status: 'Endangered',
    category: 'Mammal',
    image: '/api/placeholder/150/120',
    description: 'Largest land mammal',
    facts: ['Can live 60-70 years', 'Weighs up to 6,000 kg', 'Excellent memory']
  }
];


  const bestiaryCategories = ['All', 'Mammal', 'Antelope', 'Bird', 'Reptile'];

  const filteredBestiary = bestiaryFilter === 'All' 
    ? bestiaryData 
    : bestiaryData.filter(animal => animal.category === bestiaryFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Endangered': return '#FF5722';
      case 'Near Threatened': return '#FF9800';
      case 'Vulnerable': return '#FFC107';
      case 'Least Concern': return '#4CAF50';
      default: return '#757575';
    }
  };

  const renderEntryItem = ({ item }) => (
    <TouchableOpacity style={styles.entryCard}>
      <View style={[styles.entryIconContainer, 
        item.type === 'elephant' ? {backgroundColor: '#4CAF50'} : 
        item.type === 'lion' ? {backgroundColor: '#FF9800'} : 
        {backgroundColor: '#2196F3'}
      ]}>
        <MaterialIcons 
          name={item.type === 'elephant' ? 'pets' : item.type === 'lion' ? 'warning' : 'track-changes'} 
          size={24} 
          color="white" 
        />
      </View>
      <View style={styles.entryDetails}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <Text style={styles.entrySubtitle}>{item.location}</Text>
        <Text style={styles.entryDate}>{item.date}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#777" />
    </TouchableOpacity>
  );

  const renderBestiaryItem = ({ item }) => (
    <TouchableOpacity style={styles.bestiaryCard}>
      <Image source={{ uri: item.image }} style={styles.bestiaryImage} />
      <View style={styles.bestiaryContent}>
        <Text style={styles.bestiaryName}>{item.name}</Text>
        <Text style={styles.bestiaryScientific}>{item.scientificName}</Text>
        <View style={styles.bestiaryStatusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={styles.bestiaryStatus}>{item.status}</Text>
        </View>
        <Text style={styles.bestiaryDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#777" />
    </TouchableOpacity>
  );

  // If the camera is visible, show a simulated camera screen
  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.camera}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseCamera}
            >
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            <View style={styles.cameraButtonsRow}>
              <TouchableOpacity 
                style={styles.cameraButton}
              >
                <MaterialIcons name="flash-on" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cameraButton}
              >
                <MaterialIcons name="flip-camera-ios" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Otherwise, show the main app UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/EpiUseLogo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Wildlife Detection</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require('../assets/Jean-Steyn-ProfilePic.jpg')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>{username}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search wildlife sightings..."
              placeholderTextColor="#white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleCameraAction}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                  <MaterialIcons name="camera-alt" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>New Detection</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <MaterialIcons name="history" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleMapNavigation}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                  <MaterialIcons name="map" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Map View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
                  <MaterialIcons name="settings" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>
              Use this app to identify and learn about African wildlife through our advanced AI detection system.
            </Text>
          </View>

          {/* Bestiary Section */}
          <View style={styles.section}>
            <View style={styles.bestiaryHeader}>
              <Text style={styles.sectionTitle}>Bestiary</Text>
              <TouchableOpacity style={styles.achievementsButton}>
                <Text style={styles.achievementsText}>Achievements</Text>
              </TouchableOpacity>
            </View>
            
            {/* Bestiary Search and Filter */}
            <View style={styles.bestiaryControls}>
              <View style={styles.bestiarySearchContainer}>
                <MaterialIcons name="search" size={16} color="white" />
                <TextInput
                  style={styles.bestiarySearchInput}
                  placeholder="Search"
                  placeholderTextColor="white"
                />
              </View>
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>All</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#777" />
              </View>
            </View>

            {/* Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPills}>
              {bestiaryCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterPill,
                    bestiaryFilter === category && styles.activeFilterPill
                  ]}
                  onPress={() => setBestiaryFilter(category)}
                >
                  <Text style={[
                    styles.filterPillText,
                    bestiaryFilter === category && styles.activeFilterPillText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bestiary Grid */}
            <View style={styles.bestiaryGrid}>
              {filteredBestiary.map((animal, index) => (
                <TouchableOpacity key={animal.id} style={styles.bestiaryGridItem}>
                  <Image source={{ uri: animal.image }} style={styles.bestiaryGridImage} />
                  <Text style={styles.bestiaryGridName}>{animal.name}</Text>
                  <View style={styles.bestiaryGridStatus}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(animal.status) }]} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Detections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Detections</Text>
            <FlatList
              data={recentEntries}
              renderItem={renderEntryItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Detection Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detection Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>12</Text>
                  <Text style={styles.summaryLabel}>Elephants</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>5</Text>
                  <Text style={styles.summaryLabel}>Lions</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>3</Text>
                  <Text style={styles.summaryLabel}>Rhinos</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View Detailed Report</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Conservation Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conservation Status</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <MaterialIcons name="warning" size={24} color="#FF9800" />
                <Text style={styles.statusText}>3 potential threats detected in Sector B2</Text>
              </View>
              <View style={styles.statusRow}>
                <MaterialIcons name="notifications" size={24} color="#4CAF50" />
                <Text style={styles.statusText}>New elephant herd movement patterns recorded</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
            onPress={() => setActiveTab('home')}
          >
            <MaterialIcons name="home" size={24} color={activeTab === 'home' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'map' && styles.activeNavItem]} 
            onPress={handleMapNavigation}
          >
            <MaterialIcons name="map" size={24} color={activeTab === 'map' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'map' && styles.activeNavText]}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleCameraAction}
          >
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]} 
            onPress={handleFeedNavigation}
          >
            <MaterialIcons name="bar-chart" size={24} color={activeTab === 'reports' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>Feed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
            onPress={() => setActiveTab('profile')}
          >
            <MaterialIcons name="person" size={24} color={activeTab === 'profile' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3b1d',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  usernameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  // Bestiary Styles
  bestiaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementsButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  achievementsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  bestiaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bestiarySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginRight: 10,
  },
  bestiarySearchInput: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterLabel: {
    color: 'white',
    fontSize: 14,
    marginRight: 4,
  },
  filterPills: {
    marginBottom: 15,
  },
  filterPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterPill: {
    backgroundColor: '#ff6b00',
  },
  filterPillText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  activeFilterPillText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bestiaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bestiaryGridItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  bestiaryGridImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  bestiaryGridName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  bestiaryGridStatus: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bestiaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  bestiaryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  bestiaryContent: {
    flex: 1,
  },
  bestiaryName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bestiaryScientific: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  bestiaryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bestiaryStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 6,
  },
  bestiaryDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  entryDetails: {
    flex: 1,
  },
  entryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  entryDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 3,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 5,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 5,
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 2,
  },
  activeNavText: {
    color: 'white',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  cameraButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default MainScreen;