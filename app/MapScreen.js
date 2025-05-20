import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const params = route?.params || {};
  const username = params.username || 'User';
  
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Sample map markers data
  const mapMarkers = [
    { id: '1', type: 'elephant', latitude: -1.2921, longitude: 36.8219, count: 12, timestamp: '2h ago' },
    { id: '2', type: 'lion', latitude: -1.3011, longitude: 36.8565, count: 3, timestamp: '5h ago' },
    { id: '3', type: 'rhino', latitude: -1.2741, longitude: 36.8243, count: 2, timestamp: '1d ago' },
  ];

  const filterOptions = ['All', 'Elephants', 'Lions', 'Rhinos', 'Alerts'];

  // Navigation handlers
  const handleNavigation = (screen, tab) => {
    navigation.navigate(screen);
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor="#white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Map Content */}
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Interactive Map</Text>
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={60} color="rgba(255,255,255,0.3)" />
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <Text style={styles.sectionTitle}>Map Legend</Text>
            <View style={styles.legendItem}>
              <MaterialIcons name="pets" size={20} color="#4CAF50" />
              <Text style={styles.legendText}>Elephants</Text>
            </View>
            <View style={styles.legendItem}>
              <MaterialIcons name="warning" size={20} color="#FF9800" />
              <Text style={styles.legendText}>Lions</Text>
            </View>
            <View style={styles.legendItem}>
              <MaterialIcons name="track-changes" size={20} color="#2196F3" />
              <Text style={styles.legendText}>Rhinos</Text>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>12 Elephants detected</Text>
              <Text style={styles.activityTimestamp}>2h ago</Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
             onPress={() => handleNavigation('MainScreen', 'home')} // Changed 'Main' to 'MainScreen'
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
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 52, // Compensates for logo width + margin
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 15,
    color: 'white',
  },
  mapContainer: {
    margin: 20,
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    margin: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendText: {
    color: 'white',
    marginLeft: 10,
  },
  recentActivityContainer: {
    margin: 20,
  },
  activityItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  activityText: {
    color: 'white',
    fontSize: 16,
  },
  activityTimestamp: {
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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