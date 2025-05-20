import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
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

const MainScreen = ({ navigation, route }) => {
  // Safely access route params with default values if they don't exist
  // Error kept on recurring so added this
  const params = route?.params || {};
  const username = params.username || 'User';
  
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for wildlife detection history
  // Replace with actual data
  const recentEntries = [
    { id: '1', title: 'Elephant Detection', date: '2025-05-19', type: 'elephant', location: 'Sector A4' },
    { id: '2', title: 'Lion Sighting', date: '2025-05-19', type: 'lion', location: 'Sector B2' },
    { id: '3', title: 'Rhino Tracking', date: '2025-05-18', type: 'rhino', location: 'Sector C7' },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={require('../assets/EpiUseLogo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Wildlife Detection</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="person" size={28} color="white" />
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
            <MaterialIcons name="search" size={20} color="#777" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search wildlife sightings..."
              placeholderTextColor="#777"
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
              <TouchableOpacity style={styles.actionButton}>
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
              
              <TouchableOpacity style={styles.actionButton}>
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Start Detection</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                <Text style={styles.buttonText}>View Gallery</Text>
              </TouchableOpacity>
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
            onPress={() => setActiveTab('map')}
          >
            <MaterialIcons name="map" size={24} color={activeTab === 'map' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'map' && styles.activeNavText]}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]} 
            onPress={() => setActiveTab('reports')}
          >
            <MaterialIcons name="bar-chart" size={24} color={activeTab === 'reports' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>Reports</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    marginBottom: 15,
    gap: 15,
  },
  button: {
    backgroundColor: '#ff6b00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2e5e2b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default MainScreen;