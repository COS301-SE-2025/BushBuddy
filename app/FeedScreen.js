import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const FeedScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'elephant', 'lion', 'rhino' for now
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Sample data for wildlife detection history
  //what would the api need?
  /*const historyEntries = [
    { 
      id:
      title: 
      date:
      time:
      type:
      location:
      count: 
      description:
      confidence:
      image:
    },*/
  const historyEntries = [
    { 
      id: '1', 
      title: 'Elephant Herd Detection', 
      date: '2025-05-19', 
      time: '14:30:22',
      type: 'elephant', 
      location: 'Sector A4',
      count: 8,
      description: 'Large herd of elephants detected near the water hole. Multiple calves present.',
      confidence: 98,
      image: require('../assets/Elephant-Herd-Demo.jpg') // Placeholder replace with cool pics later future Jean dont forget
    },
    { 
      id: '2', 
      title: 'Lion Pride Sighting', 
      date: '2025-05-19', 
      time: '11:15:46',
      type: 'lion', 
      location: 'Sector B2',
      count: 5,
      description: 'Pride of lions spotted resting in the shade. Two males and three females identified.',
      confidence: 94,
      image: require('../assets/Pride-Lions-Demo.jpg') // Placeholder
    },
    { 
      id: '3', 
      title: 'Rhino Tracking', 
      date: '2025-05-18', 
      time: '09:45:10',
      type: 'rhino', 
      location: 'Sector C7',
      count: 2,
      description: 'Two rhinoceros tracked moving across the savanna. One adult and one juvenile.',
      confidence: 96,
      image: require('../assets/rhino-demo.jpg') // Placeholder
    },
    { 
      id: '4', 
      title: 'Elephant Bull Detection', 
      date: '2025-05-18', 
      time: '16:20:05',
      type: 'elephant', 
      location: 'Sector D3',
      count: 1,
      description: 'Lone bull elephant detected moving through the grasslands. Large tusks noted.',
      confidence: 99,
      image: require('../assets/Rhino-Bull-Demo.jpg') // Placeholder
    },
    { 
      id: '5', 
      title: 'Lion Hunt Observation', 
      date: '2025-05-17', 
      time: '07:30:42',
      type: 'lion', 
      location: 'Sector B5',
      count: 3,
      description: 'Three lionesses observed in hunting formation. Tracking a herd of gazelles.',
      confidence: 92,
      image: require('../assets/Lion-Hunt.jpg') // Placeholder
    },
  ];

  // Make 
  // Filter the entries based on the selected filter
  const filteredEntries = historyEntries.filter(entry => {
    // Apply search filter first
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        entry.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then apply type filter
    if (filter === 'all') {
      return matchesSearch;
    } else {
      return entry.type === filter && matchesSearch;
    }
  });

  const renderEntryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.entryCard}
      onPress={() => {
        setSelectedEntry(item);
        setDetailModalVisible(true);
      }}
    >
      <Image source={item.image} style={styles.entryImage} />
      <View style={styles.entryContent}>
        <View style={styles.entryHeader}>
          <View style={[
            styles.typeIndicator,
            item.type === 'elephant' ? { backgroundColor: '#4CAF50' } :
            item.type === 'lion' ? { backgroundColor: '#FF9800' } :
            { backgroundColor: '#2196F3' }
          ]} />
          <Text style={styles.entryTitle}>{item.title}</Text>
        </View>
        <View style={styles.entryDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={14} color="#777" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={14} color="#777" />
            <Text style={styles.detailText}>{item.date}, {item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="group" size={14} color="#777" />
            <Text style={styles.detailText}>{item.count} detected</Text>
          </View>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#777" />
    </TouchableOpacity>
  );

  // Modal for detailed view
  const renderDetailModal = () => {
    if (!selectedEntry) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Detection Details</Text>
              <TouchableOpacity style={styles.shareButton}>
                <MaterialIcons name="share" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <Image source={selectedEntry.image} style={styles.detailImage} />
            
            <View style={styles.detailContent}>
              <View style={styles.detailHeader}>
                <View style={[
                  styles.detailTypeIndicator,
                  selectedEntry.type === 'elephant' ? { backgroundColor: '#4CAF50' } :
                  selectedEntry.type === 'lion' ? { backgroundColor: '#FF9800' } :
                  { backgroundColor: '#2196F3' }
                ]}>
                  <MaterialIcons 
                    name={
                      selectedEntry.type === 'elephant' ? 'pets' : 
                      selectedEntry.type === 'lion' ? 'warning' : 
                      'track-changes'
                    } 
                    size={24} 
                    color="white" 
                  />
                </View>
                <Text style={styles.detailTitle}>{selectedEntry.title}</Text>
              </View>
              
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <MaterialIcons name="location-on" size={20} color="#666" />
                  <Text style={styles.infoText}>{selectedEntry.location}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="access-time" size={20} color="#666" />
                  <Text style={styles.infoText}>{selectedEntry.date}, {selectedEntry.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="group" size={20} color="#666" />
                  <Text style={styles.infoText}>{selectedEntry.count} individuals detected</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="verified" size={20} color="#666" />
                  <Text style={styles.infoText}>Confidence: {selectedEntry.confidence}%</Text>
                </View>
              </View>
              
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{selectedEntry.description}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                  onPress={() => {
                    setDetailModalVisible(false);
                    navigation.navigate('MapScreen');
                  }}
                >
                  <MaterialIcons name="map" size={20} color="white" />
                  <Text style={styles.actionButtonText}>View on Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
                  <MaterialIcons name="edit" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Add Notes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c8c4a', '#1e3b1d']}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detection History</Text>
          <TouchableOpacity style={styles.optionsButton}>
            <MaterialIcons name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#white" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search detections..."
              placeholderTextColor="#white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <MaterialIcons name="clear" size={20} color="#777" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'elephant' && styles.activeFilterTab]}
            onPress={() => setFilter('elephant')}
          >
            <MaterialIcons 
              name="pets" 
              size={18} 
              color={filter === 'elephant' ? 'white' : '#A0A0A0'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterTabText, filter === 'elephant' && styles.activeFilterTabText]}>Elephants</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'lion' && styles.activeFilterTab]}
            onPress={() => setFilter('lion')}
          >
            <MaterialIcons 
              name="warning" 
              size={18} 
              color={filter === 'lion' ? 'white' : '#A0A0A0'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterTabText, filter === 'lion' && styles.activeFilterTabText]}>Lions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, filter === 'rhino' && styles.activeFilterTab]}
            onPress={() => setFilter('rhino')}
          >
            <MaterialIcons 
              name="track-changes" 
              size={18} 
              color={filter === 'rhino' ? 'white' : '#A0A0A0'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterTabText, filter === 'rhino' && styles.activeFilterTabText]}>Rhinos</Text>
          </TouchableOpacity>
        </View>

        {/* Entries List */}
        <FlatList
          data={filteredEntries}
          renderItem={renderEntryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={60} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No detections found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          )}
        />

        {/* Detail Modal */}
        {renderDetailModal()}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('MainScreen')}
          >
            <MaterialIcons name="home" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <MaterialIcons name="map" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Map</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('DetectionScreen')}
          >
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('ReportsScreen')}
          >
            <MaterialIcons name="bar-chart" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Feed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <MaterialIcons name="person" size={24} color="#A0A0A0" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Styles
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  clearButton: {
    padding: 5,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterIcon: {
    marginRight: 5,
  },
  filterTabText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  activeFilterTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  entryImage: {
    width: 100,
    height: 100,
  },
  entryContent: {
    flex: 1,
    padding: 15,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  entryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  entryDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 5,
  },
  detailImage: {
    width: '100%',
    height: 200,
  },
  detailContent: {
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailTypeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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

export default FeedScreen;