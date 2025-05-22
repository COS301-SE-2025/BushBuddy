import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// We'll use a mock map implementation that doesn't require external dependencies
// This will ensure compatibility with your current setup

const { width, height } = Dimensions.get('window');

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const params = route?.params || {};
  const username = params.username || 'User';
  
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [region, setRegion] = useState({
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  });
  const [userLocation, setUserLocation] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isMapReady, setIsMapReady] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Animation values
  const detailsAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  // Sample map markers data with enhanced details
  const mapMarkers = [
    { 
      id: '1', 
      type: 'elephant', 
      species: 'African Bush Elephant',
      latitude: -1.2921, 
      longitude: 36.8219, 
      count: 12, 
      timestamp: '2h ago',
      description: 'Herd moving north toward water source',
      conservation: 'Vulnerable',
      movement: [
        { latitude: -1.2951, longitude: 36.8200, timestamp: '4h ago' },
        { latitude: -1.2935, longitude: 36.8210, timestamp: '3h ago' },
        { latitude: -1.2921, longitude: 36.8219, timestamp: '2h ago' }
      ],
      color: '#4CAF50'
    },
    { 
      id: '2', 
      type: 'lion', 
      species: 'East African Lion',
      latitude: -1.3011, 
      longitude: 36.8565, 
      count: 3, 
      timestamp: '5h ago',
      description: 'Pride resting after hunt',
      conservation: 'Vulnerable',
      movement: [
        { latitude: -1.3020, longitude: 36.8545, timestamp: '7h ago' },
        { latitude: -1.3015, longitude: 36.8555, timestamp: '6h ago' },
        { latitude: -1.3011, longitude: 36.8565, timestamp: '5h ago' }
      ],
      color: '#FF9800'
    },
    { 
      id: '3', 
      type: 'rhino', 
      species: 'Black Rhinoceros',
      latitude: -1.2741, 
      longitude: 36.8243, 
      count: 2, 
      timestamp: '1d ago',
      description: 'Mother and calf spotted near south ridge',
      conservation: 'Critically Endangered',
      movement: [
        { latitude: -1.2751, longitude: 36.8233, timestamp: '36h ago' },
        { latitude: -1.2746, longitude: 36.8238, timestamp: '24h ago' },
        { latitude: -1.2741, longitude: 36.8243, timestamp: '1d ago' }
      ],
      color: '#2196F3'
    },
    { 
      id: '4', 
      type: 'giraffe', 
      species: 'Rothschild Giraffe',
      latitude: -1.2851, 
      longitude: 36.8300, 
      count: 5, 
      timestamp: '3h ago',
      description: 'Small group feeding on acacia trees',
      conservation: 'Near Threatened',
      movement: [
        { latitude: -1.2861, longitude: 36.8290, timestamp: '5h ago' },
        { latitude: -1.2855, longitude: 36.8295, timestamp: '4h ago' },
        { latitude: -1.2851, longitude: 36.8300, timestamp: '3h ago' }
      ],
      color: '#9C27B0'
    },
    { 
      id: '5', 
      type: 'warning', 
      category: 'Poaching Risk',
      latitude: -1.2981, 
      longitude: 36.8319, 
      timestamp: '30m ago',
      description: 'Suspicious vehicle spotted near elephant territory',
      urgency: 'High',
      color: '#F44336'
    }
  ];

  const filterOptions = ['All', 'Elephants', 'Lions', 'Rhinos', 'Giraffes', 'Alerts'];

  // Get user location on component mount
  useEffect(() => {
    // Mock getting user location instead of using expo-location
    setTimeout(() => {
      setUserLocation({
        latitude: -1.2900,
        longitude: 36.8220
      });
    }, 1000);
  }, []);

  // Handle showing/hiding animal details
  useEffect(() => {
    if (showDetails) {
      Animated.timing(detailsAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(detailsAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [showDetails]);

  // Filter handlers
  const filteredMarkers = selectedFilter === 'All' 
    ? mapMarkers 
    : mapMarkers.filter(marker => {
        if (selectedFilter === 'Alerts') return marker.type === 'warning';
        return marker.type.toLowerCase() === selectedFilter.toLowerCase().slice(0, -1);
      });

  // Navigate to specific marker on map
  const focusMarker = (marker) => {
    // Instead of animating the map, we just set the selected animal
    setSelectedAnimal(marker);
    setShowDetails(true);
  };

  // Navigation handlers
  const handleNavigation = (screen, tab) => {
    navigation.navigate(screen);
    setActiveTab(tab);
  };

  // Handle map ready event
  const onMapReady = () => {
    setIsMapReady(true);
  };

  // Report sighting
  const reportSighting = () => {
    Alert.alert(
      "Report Wildlife Sighting",
      "Use camera to document and report wildlife sightings",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Camera", onPress: () => alert('Camera functionality would open here') }
      ]
    );
  };

  // Get appropriate icon for marker
  const getMarkerIcon = (type) => {
    switch(type) {
      case 'elephant': return 'elephant';
      case 'lion': return 'cat';
      case 'rhino': return 'rhino';
      case 'giraffe': return 'giraffe';
      case 'warning': return 'alert-circle';
      default: return 'paw';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Image 
                source={require('../assets/EpiUseLogo.png')} 
                style={styles.logo} 
                resizeMode="contain"
            />
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Wildlife Map</Text>
            </View>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filterContainer}
          >
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  selectedFilter === filter && styles.activeFilterPill
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text 
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.activeFilterText
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Map Content */}
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Interactive Map</Text>
            
            {/* Custom Map Implementation */}
            <View style={styles.customMapContainer}>
              {/* Map Background */}
              <View style={styles.mapBackground}>
                <MaterialIcons name="map" size={60} color="rgba(255,255,255,0.3)" />
              </View>
              
              {/* Map Markers */}
              {filteredMarkers.map((marker) => (
                <TouchableOpacity
                  key={marker.id}
                  style={[
                    styles.customMarker,
                    {
                      backgroundColor: marker.color,
                      left: `${30 + Math.random() * 40}%`, // Random position for demo
                      top: `${20 + Math.random() * 50}%`,  // Random position for demo
                    }
                  ]}
                  onPress={() => focusMarker(marker)}
                >
                  <MaterialCommunityIcons
                    name={getMarkerIcon(marker.type)}
                    size={18}
                    color="white"
                  />
                  {marker.count && (
                    <Text style={styles.markerCount}>{marker.count}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity 
                style={styles.mapControlButton}
                onPress={() => alert('Center map on your location')}
              >
                <MaterialIcons name="my-location" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.mapControlButton}
                onPress={reportSighting}
              >
                <MaterialIcons name="add-location" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Animal Detail Panel (animated) */}
          {selectedAnimal && (
            <Animated.View style={[
              styles.animalDetailPanel,
              {
                transform: [
                  { translateY: detailsAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0]
                    })
                  }
                ],
                opacity: detailsAnimation
              }
            ]}>
              <View style={styles.detailHandle}>
                <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
                  <View style={styles.handleBar} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <MaterialCommunityIcons name={getMarkerIcon(selectedAnimal.type)} size={24} color={selectedAnimal.color} />
                  <View style={styles.detailHeaderText}>
                    <Text style={styles.detailTitle}>
                      {selectedAnimal.type !== 'warning' 
                        ? `${selectedAnimal.species || selectedAnimal.type} (${selectedAnimal.count})`
                        : selectedAnimal.category}
                    </Text>
                    <Text style={styles.detailSubtitle}>
                      {selectedAnimal.timestamp} • {selectedAnimal.type !== 'warning' ? 'Conservation Status: ' + (selectedAnimal.conservation || 'Unknown') : 'Urgency: ' + selectedAnimal.urgency}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.detailDescription}>
                  {selectedAnimal.description}
                </Text>
                
                {selectedAnimal.type !== 'warning' && (
                  <View style={styles.activityGraph}>
                    <Text style={styles.graphTitle}>Movement History</Text>
                    <View style={styles.graphContainer}>
                      {selectedAnimal.movement.map((point, index) => (
                        <View key={index} style={styles.timelinePoint}>
                          <View style={[styles.timelineDot, { backgroundColor: selectedAnimal.color }]} />
                          <Text style={styles.timelineText}>{point.timestamp}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {selectedAnimal.type === 'warning' ? (
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F44336' }]}>
                    <Text style={styles.actionButtonText}>Report Incident</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: selectedAnimal.color }]}>
                    <Text style={styles.actionButtonText}>Track Movement</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </Animated.View>
          )}
        </View>

        {/* Fixed Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
            onPress={() => handleNavigation('MainScreen', 'home')} 
          >
            <MaterialIcons name="home" size={24} color={activeTab === 'home' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'map' && styles.activeNavItem]} 
            onPress={() => handleNavigation('MapScreen', 'map')}
          >
            <MaterialIcons name="map" size={24} color={activeTab === 'map' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'map' && styles.activeNavText]}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => alert('Camera functionality')}
          >
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]} 
            onPress={() => handleNavigation('FeedScreen', 'reports')}
          >
            <MaterialIcons name="bar-chart" size={24} color={activeTab === 'reports' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
            onPress={() => handleNavigation('ProfileScreen', 'profile')}
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
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 42,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchIcon: {
    position: 'absolute',
    left: 30,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingLeft: 45,
    paddingRight: 20,
    color: 'white',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
  },
  activeFilterPill: {
    backgroundColor: '#ff6b00',
  },
  filterText: {
    color: 'white',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 15,
    margin: 20,
    marginBottom: 10,
    height: 300,
  },
  customMapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#27502a',
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27502a',
  },
  customMarker: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  markerContainer: {
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  markerCount: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  animalDetailPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 59, 29, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 80,
    maxHeight: height * 0.6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
    elevation: 10,
    zIndex: 100,
  },
  detailHandle: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
  },
  detailContent: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  detailTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  detailDescription: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  activityGraph: {
    marginVertical: 15,
  },
  graphTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  graphContainer: {
    paddingVertical: 10,
  },
  timelinePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  timelineText: {
    color: 'white',
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    elevation: 5,
  },
});

export default MapScreen;