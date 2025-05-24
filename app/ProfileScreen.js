// We should maybe rethink if we need the Account at the option since we have the Profile edit profile functionality
// The change email and password options can be moved to the Edit Profile modal and is hence redundant
// I still left it in for now, but we can remove it later if we want to
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  
  // Safely access route params with default values
  const params = route?.params || {};
  const username = params.username || 'User';
  
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Sample user data (now using state so it can be updated)
  // This data can be fetched from an API or database later when we implement backend functionality
  const [userData, setUserData] = useState({
    fullName: 'Johannes Gerhardus Jean Steyn',
    role: 'Wildlife Researcher',
    location: 'Kruger National Park',
    joinDate: 'Member since January 2025',
    email: 'jeanateyn007@gmail.com',
    detections: 87,
    contributions: 42,
    accuracy: '94%',
    bio: 'Passionate about wildlife conservation and research. Dedicated to protecting endangered species in South Africa.',
    phone: '+27 60 702 5919'
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    fullName: userData.fullName,
    role: userData.role,
    location: userData.location,
    email: userData.email,
    bio: userData.bio,
    phone: userData.phone
  });
  
  // Sample achievements
  // Add more later future Jean
  const achievements = [
    { id: '1', title: 'Big Five Spotter', description: 'Detected all Big Five animals', icon: 'emoji-events', completed: true },
    { id: '2', title: 'Bird Watcher', description: 'Identified 20 different bird species', icon: 'flight', completed: true },
    { id: '3', title: 'Conservation Hero', description: 'Reported 5 potential threats', icon: 'security', completed: false },
    { id: '4', title: 'Night Explorer', description: 'Made 10 nocturnal detections', icon: 'nightlight', completed: true },
  ];

  // Navigate to other screens
  const handleHomeNavigation = () => {
    navigation.navigate('MainScreen');
    setActiveTab('home');
  };

  const handleMapNavigation = () => {
    navigation.navigate('MapScreen');
    setActiveTab('map');
  };

  const handleFeedNavigation = () => {
    navigation.navigate('FeedScreen');
    setActiveTab('feed');
  };

  // Handle camera action
  const handleCameraAction = () => {
    Alert.alert(
      'Camera Access',
      'Would open camera for wildlife detection',
      [{ text: 'OK' }]
    );
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => console.log('User logged out') }
      ]
    );
  };

  // Handle settings toggle
  const toggleDarkMode = () => setDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const toggleLocationTracking = () => setLocationTracking(previousState => !previousState);

  // Handle edit profile
  const handleEditProfile = () => {
    setEditFormData({
      fullName: userData.fullName,
      role: userData.role,
      location: userData.location,
      email: userData.email,
      bio: userData.bio,
      phone: userData.phone
    });
    setIsEditModalVisible(true);
  };


  // Handle profile photo change
  const handleChangeProfilePhoto = () => {
    Alert.alert(
      'Change Profile Photo', // Looks good on iOS and Android
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Handle save profile changes
  const handleSaveProfile = () => {
    // Validate required fields
    // Does this count as testing?
    if (!editFormData.fullName.trim() || !editFormData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Simple email validation
    // Does this count as testing?
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Update user data
    setUserData(prevData => ({
      ...prevData,
      ...editFormData
    }));

    setIsEditModalVisible(false);
    
    Alert.alert(
      'Success',
      'Profile updated successfully!',
      [{ text: 'OK' }]
    );
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', onPress: () => setIsEditModalVisible(false) }
      ]
    );
  };

  // Update form field
  const updateFormField = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <Image 
            source={require('../assets/EpiUseLogo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => Alert.alert('Settings', 'Would open detailed settings')}
          >
            <MaterialIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={require('../assets/Jean-Steyn-ProfilePic.jpg')} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.editImageButton}
                  onPress={handleChangeProfilePhoto}
                >
                  <MaterialIcons name="camera-alt" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.fullName}</Text>
                <Text style={styles.profileRole}>{userData.role}</Text>
                <Text style={styles.profileLocation}>
                  <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.7)" /> {userData.location}
                </Text>
                <Text style={styles.profileJoinDate}>{userData.joinDate}</Text>
              </View>
            </View>
            
            {/* Bio Section */}
            {userData.bio && (
              <View style={styles.bioSection}>
                <Text style={styles.bioText}>{userData.bio}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
              <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Statistics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.detections}</Text>
                <Text style={styles.statLabel}>Detections</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.contributions}</Text>
                <Text style={styles.statLabel}>Contributions</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userData.accuracy}</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>
          </View>

          {/* Achievements Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementItem, 
                  achievement.completed ? styles.achievementCompleted : styles.achievementIncomplete
                ]}
              >
                <View style={styles.achievementIconContainer}>
                  <MaterialIcons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.completed ? '#FFD700' : 'rgba(255,255,255,0.4)'} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                {achievement.completed ? (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                ) : (
                  <MaterialIcons name="radio-button-unchecked" size={24} color="rgba(255,255,255,0.4)" />
                )}
              </View>
            ))}
            
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Achievements</Text>
              <MaterialIcons name="chevron-right" size={20} color="#ff6b00" />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <MaterialIcons name="nightlight-round" size={24} color="white" />
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#4CAF50" }}
                  thumbColor={darkMode ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDarkMode}
                  value={darkMode}
                />
              </View>
              
              <View style={styles.settingItem}>
                <MaterialIcons name="notifications" size={24} color="white" />
                <Text style={styles.settingText}>Notifications</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#4CAF50" }}
                  thumbColor={notifications ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleNotifications}
                  value={notifications}
                />
              </View>
              
              <View style={styles.settingItem}>
                <MaterialIcons name="location-on" size={24} color="white" />
                <Text style={styles.settingText}>Location Tracking</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#4CAF50" }}
                  thumbColor={locationTracking ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleLocationTracking}
                  value={locationTracking}
                />
              </View>
            </View>
          </View>

          {/* Account Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.accountContainer}>
              <TouchableOpacity style={styles.accountOption}>
                <MaterialIcons name="email" size={24} color="white" />
                <Text style={styles.accountOptionText}>Change Email</Text>
                <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.accountOption}>
                <MaterialIcons name="lock" size={24} color="white" />
                <Text style={styles.accountOptionText}>Change Password</Text>
                <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.accountOption}>
                <MaterialIcons name="help" size={24} color="white" />
                <Text style={styles.accountOptionText}>Help & Support</Text>
                <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.accountOption}>
                <MaterialIcons name="info" size={24} color="white" />
                <Text style={styles.accountOptionText}>About App</Text>
                <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]} 
            onPress={handleHomeNavigation}
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
            style={[styles.navItem, activeTab === 'feed' && styles.activeNavItem]} 
            onPress={handleFeedNavigation}
          >
            <MaterialIcons name="bar-chart" size={24} color={activeTab === 'feed' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'feed' && styles.activeNavText]}>Feed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]} 
          >
            <MaterialIcons name="person" size={24} color={activeTab === 'profile' ? 'white' : '#A0A0A0'} />
            <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCancelEdit}
        >
          <KeyboardAvoidingView 
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <LinearGradient
              colors={['#4c8c4a', '#1e3b1d']}
              style={styles.modalGradient}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={handleCancelEdit}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity 
                  style={styles.modalSaveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <ScrollView style={styles.modalContent}>
                {/* Profile Photo Section */}
                <View style={styles.modalPhotoSection}>
                  <View style={styles.modalProfileImageContainer}>
                    <Image 
                      source={require('../assets/Jean-Steyn-ProfilePic.jpg')} 
                      style={styles.modalProfileImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.modalEditImageButton}
                      onPress={handleChangeProfilePhoto}
                    >
                      <MaterialIcons name="camera-alt" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                    style={styles.changePhotoButton}
                    onPress={handleChangeProfilePhoto}
                  >
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editFormData.fullName}
                      onChangeText={(text) => updateFormField('fullName', text)}
                      placeholder="Enter your full name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Role/Title</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editFormData.role}
                      onChangeText={(text) => updateFormField('role', text)}
                      placeholder="Enter your role or title"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editFormData.location}
                      onChangeText={(text) => updateFormField('location', text)}
                      placeholder="Enter your location"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editFormData.email}
                      onChangeText={(text) => updateFormField('email', text)}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editFormData.phone}
                      onChangeText={(text) => updateFormField('phone', text)}
                      placeholder="Enter your phone number"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Bio</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={editFormData.bio}
                      onChangeText={(text) => updateFormField('bio', text)}
                      placeholder="Tell us about yourself..."
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </KeyboardAvoidingView>
        </Modal>
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
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -92,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff6b00',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  profileRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 2,
  },
  profileLocation: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileJoinDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  bioSection: {
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bioText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  editProfileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  editProfileText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
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
  statsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  achievementCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  achievementIncomplete: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  viewAllText: {
    color: '#ff6b00',
    fontSize: 16,
    marginRight: 5,
  },
  settingsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  accountContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 15,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  accountOptionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#e53935',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalSaveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalSaveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalPhotoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 30,
  },
  modalProfileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  modalEditImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#ff6b00',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingBottom: 40,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
});

export default ProfileScreen;