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
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  const [isAchievementsModalVisible, setIsAchievementsModalVisible] = useState(false);
  
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
  
  // More achievements with categories
  // Wildlife Detection Achievements
  // Conservation Achievements
  // Activity Achievements
  // Social & Community Achievements
  // Technical Achievements
  // Special Achievements
  // Add more categories if can think of any
  const achievements = [
    // Wildlife Detection Achievements
    { 
      id: '1', 
      title: 'Big Five Spotter', 
      description: 'Detected all Big Five animals', 
      icon: 'emoji-events', 
      completed: true,
      category: 'Wildlife Detection',
      rarity: 'legendary'
    },
    { 
      id: '2', 
      title: 'Bird Watcher', 
      description: 'Identified 20 different bird species', 
      icon: 'flight', 
      completed: true,
      category: 'Wildlife Detection',
      rarity: 'common'
    },
    { 
      id: '3', 
      title: 'Reptile Enthusiast', 
      description: 'Spotted 10 different reptile species', 
      icon: 'pets', 
      completed: false,
      category: 'Wildlife Detection',
      rarity: 'rare'
    },
    { 
      id: '4', 
      title: 'Primate Observer', 
      description: 'Detected 5 primate species', 
      icon: 'face', 
      completed: true,
      category: 'Wildlife Detection',
      rarity: 'uncommon'
    },
    { 
      id: '5', 
      title: 'Marine Life Explorer', 
      description: 'Identified 15 aquatic species', 
      icon: 'waves', 
      completed: false,
      category: 'Wildlife Detection',
      rarity: 'rare'
    },
    
    // Conservation Achievements
    { 
      id: '6', 
      title: 'Conservation Hero', 
      description: 'Reported 5 potential threats', 
      icon: 'security', 
      completed: false,
      category: 'Conservation',
      rarity: 'epic'
    },
    { 
      id: '7', 
      title: 'Environmental Guardian', 
      description: 'Reported 10 environmental issues', 
      icon: 'eco', 
      completed: true,
      category: 'Conservation',
      rarity: 'rare'
    },
    { 
      id: '8', 
      title: 'Habitat Protector', 
      description: 'Documented habitat preservation efforts', 
      icon: 'forest', 
      completed: false,
      category: 'Conservation',
      rarity: 'epic'
    },
    
    // Activity Achievements
    { 
      id: '9', 
      title: 'Night Explorer', 
      description: 'Made 10 nocturnal detections', 
      icon: 'nightlight', 
      completed: true,
      category: 'Activity',
      rarity: 'uncommon'
    },
    { 
      id: '10', 
      title: 'Dawn Patrol', 
      description: 'Active during 5 sunrise sessions', 
      icon: 'wb-sunny', 
      completed: true,
      category: 'Activity',
      rarity: 'common'
    },
    { 
      id: '11', 
      title: 'Weather Warrior', 
      description: 'Detected wildlife in 3 different weather conditions', 
      icon: 'cloud', 
      completed: false,
      category: 'Activity',
      rarity: 'uncommon'
    },
    { 
      id: '12', 
      title: 'Distance Tracker', 
      description: 'Covered 100km while wildlife spotting', 
      icon: 'directions-walk', 
      completed: true,
      category: 'Activity',
      rarity: 'rare'
    },
    
    // Social & Community Achievements
    { 
      id: '13', 
      title: 'Community Helper', 
      description: 'Helped 10 other researchers', 
      icon: 'group', 
      completed: false,
      category: 'Community',
      rarity: 'uncommon'
    },
    { 
      id: '14', 
      title: 'Knowledge Sharer', 
      description: 'Shared findings with 20 community members', 
      icon: 'share', 
      completed: true,
      category: 'Community',
      rarity: 'common'
    },
    { 
      id: '15', 
      title: 'Mentor', 
      description: 'Guided 5 new researchers', 
      icon: 'school', 
      completed: false,
      category: 'Community',
      rarity: 'epic'
    },
    
    // Technical Achievements
    { 
      id: '16', 
      title: 'Photo Pro', 
      description: 'Captured 100 high-quality wildlife photos', 
      icon: 'camera-alt', 
      completed: true,
      category: 'Technical',
      rarity: 'rare'
    },
    { 
      id: '17', 
      title: 'Data Collector', 
      description: 'Logged 500 data points', 
      icon: 'assessment', 
      completed: false,
      category: 'Technical',
      rarity: 'uncommon'
    },
    { 
      id: '18', 
      title: 'Tech Savvy', 
      description: 'Used 5 different detection tools', 
      icon: 'build', 
      completed: true,
      category: 'Technical',
      rarity: 'common'
    },
    
    // Special Achievements
    { 
      id: '19', 
      title: 'Rare Species Hunter', 
      description: 'Spotted 3 endangered species', 
      icon: 'star', 
      completed: false,
      category: 'Special',
      rarity: 'legendary'
    },
    { 
      id: '20', 
      title: 'First Discovery', 
      description: 'First to spot a species in your region', 
      icon: 'explore', 
      completed: false,
      category: 'Special',
      rarity: 'legendary'
    },
    { 
      id: '21', 
      title: 'Consistency Champion', 
      description: 'Active for 30 consecutive days', 
      icon: 'event-available', 
      completed: true,
      category: 'Special',
      rarity: 'epic'
    },
    { 
      id: '22', 
      title: 'Explorer', 
      description: 'Visited 10 different locations', 
      icon: 'map', 
      completed: true,
      category: 'Special',
      rarity: 'rare'
    }
  ];

  // Get rarity color
  // Fancy stuff see what the members think
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#4CAF50';
      case 'uncommon': return '#2196F3';
      case 'rare': return '#9C27B0';
      case 'epic': return '#FF9800';
      case 'legendary': return '#FFD700';
      default: return '#4CAF50';
    }
  };

  // Get achievements by category
  const getAchievementsByCategory = () => {
    const categories = {};
    achievements.forEach(achievement => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = [];
      }
      categories[achievement.category].push(achievement);
    });
    return categories;
  };

  // Get completion stats
  const getCompletionStats = () => {
    const completed = achievements.filter(a => a.completed).length;
    const total = achievements.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

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

  // Camera navigation handler
  const handleCameraNavigation = () => {
    navigation.navigate('CameraPage');
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

  // Handle view all achievements
  const handleViewAllAchievements = () => {
    setIsAchievementsModalVisible(true);
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

  // Get featured achievements (first 4 completed + first 2 incomplete)
  const getFeaturedAchievements = () => {
    const completed = achievements.filter(a => a.completed).slice(0, 4);
    const incomplete = achievements.filter(a => !a.completed).slice(0, 2);
    return [...completed, ...incomplete].slice(0, 4);
  };

  const completionStats = getCompletionStats();
  const featuredAchievements = getFeaturedAchievements();
  const achievementsByCategory = getAchievementsByCategory();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#F7FAF8', '#F7FAF8']}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/BushBuddy.webp')} 
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
                  source={require('../assets/Jean-Steyn-ProfilePic.webp')} 
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
          {/* Added more achievements for the demo */}
          <View style={styles.section}>
            <View style={styles.achievementHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.achievementProgress}>
                {completionStats.completed}/{completionStats.total} ({completionStats.percentage}%)
              </Text>
            </View>
            
            {featuredAchievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementItem, 
                  achievement.completed ? styles.achievementCompleted : styles.achievementIncomplete
                ]}
              >
                <View style={[styles.achievementIconContainer, { borderColor: getRarityColor(achievement.rarity) }]}>
                  <MaterialIcons 
                    name={achievement.icon} 
                    size={24} 
                    color={achievement.completed ? getRarityColor(achievement.rarity) : 'rgba(255,255,255,0.4)'} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={[styles.achievementRarity, { color: getRarityColor(achievement.rarity) }]}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </Text>
                </View>
                {achievement.completed ? (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                ) : (
                  <MaterialIcons name="radio-button-unchecked" size={24} color="rgba(255,255,255,0.4)" />
                )}
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllAchievements}
            >
              <Text style={styles.viewAllText}>View All Achievements</Text>
              <MaterialIcons name="chevron-right" size={20} color="#ff6b00" />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={styles.section} testID='darkModeSwitch'>
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
    onPress={handleCameraNavigation}
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
              colors={['#F7FAF8', '#F7FAF8']}
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
                      source={require('../assets/Jean-Steyn-ProfilePic.webp')} 
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
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </ScrollView>
            </LinearGradient>
          </KeyboardAvoidingView>
        </Modal>

        {/* Achievements Modal */}
        <Modal
          visible={isAchievementsModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAchievementsModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <LinearGradient
              colors={['#4c8c4a', '#1e3b1d']}
              style={styles.modalGradient}
            >
              {/* Achievements Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setIsAchievementsModalVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>All Achievements</Text>
                <View style={styles.modalCloseButton} />
              </View>

              {/* Achievement Stats */}
              <View style={styles.achievementStatsContainer}>
                <Text style={styles.achievementStatsText}>
                  Progress: {completionStats.completed}/{completionStats.total} ({completionStats.percentage}%)
                </Text>
              </View>

              {/* Achievements Content */}
              <ScrollView style={styles.modalContent}>
                {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
                  <View key={category} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <Text style={styles.categorySubtitle}>
                      {categoryAchievements.filter(a => a.completed).length}/{categoryAchievements.length} completed
                    </Text>
                    
                    {categoryAchievements.map((achievement) => (
                      <View 
                        key={achievement.id} 
                        style={[
                          styles.modalAchievementItem, 
                          achievement.completed ? styles.modalAchievementCompleted : styles.modalAchievementIncomplete
                        ]}
                      >
                        <View style={[styles.modalAchievementIconContainer, { borderColor: getRarityColor(achievement.rarity) }]}>
                          <MaterialIcons 
                            name={achievement.icon} 
                            size={28} 
                            color={achievement.completed ? getRarityColor(achievement.rarity) : 'rgba(255,255,255,0.4)'} 
                          />
                        </View>
                        <View style={styles.modalAchievementInfo}>
                          <Text style={styles.modalAchievementTitle}>{achievement.title}</Text>
                          <Text style={styles.modalAchievementDescription}>{achievement.description}</Text>
                          <View style={styles.modalAchievementMeta}>
                            <Text style={[styles.modalAchievementRarity, { color: getRarityColor(achievement.rarity) }]}>
                              {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                            </Text>
                            {achievement.completed && (
                              <Text style={styles.completedText}>✓ Completed</Text>
                            )}
                          </View>
                        </View>
                        {achievement.completed ? (
                          <MaterialIcons name="check-circle" size={28} color="#4CAF50" />
                        ) : (
                          <MaterialIcons name="radio-button-unchecked" size={28} color="rgba(255,255,255,0.4)" />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </LinearGradient>
          </SafeAreaView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF8',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    height: 100,
    backgroundColor: "#395936"
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Profile Card Styles
  profileCard: {
    backgroundColor: '#395936',
    opacity: 0.9,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    marginTop: 10
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4c8c4a',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  profileJoinDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  bioSection: {
    marginBottom: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bioText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b00',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  editProfileText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
  },

  // Section Styles
  section: {
    backgroundColor: '#395936',
    opacity: 0.9,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b00',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
  },

  // Achievement Styles
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  achievementProgress: {
    fontSize: 14,
    color: '#ff6b00',
    fontWeight: '600',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  achievementCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  achievementIncomplete: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  achievementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  achievementRarity: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ff6b00',
  },
  viewAllText: {
    color: '#ff6b00',
    fontWeight: '600',
    marginRight: 8,
  },

  // Settings Styles
  settingsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
  },

  // Account Styles
  accountContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 5,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  accountOptionText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 53, 70, 0.83)', // Better red such that the logout looks nicer
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },

  // Bottom Navigation Styles future Jean
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#395936',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  activeNavText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#ff6b00',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalCloseButton: {
    padding: 8,
    width: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  modalSaveButton: {
    backgroundColor: '#ff6b00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalSaveText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Edit Profile Modal Styles
  modalPhotoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalProfileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalEditImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4c8c4a',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  changePhotoButton: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ff6b00',
  },
  changePhotoText: {
    color: '#ff6b00',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Achievements Modal Styles
  achievementStatsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  achievementStatsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b00',
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  categorySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  modalAchievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  modalAchievementCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  modalAchievementIncomplete: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modalAchievementIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalAchievementInfo: {
    flex: 1,
  },
  modalAchievementTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    marginBottom: 6,
  },
  modalAchievementDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    lineHeight: 18,
  },
  modalAchievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAchievementRarity: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginRight: 12,
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default ProfileScreen;