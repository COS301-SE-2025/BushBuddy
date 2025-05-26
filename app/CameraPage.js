import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // NB remember to install @react-navigation/native and @react-navigation/native-stack
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CameraPage = () => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState('camera');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Navigation handlers
  const handleNavigation = (screen, tab) => {
    navigation.navigate(screen);
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Image 
          source={require('../assets/EpiUseLogo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        /> */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Beast Scanner</Text>
        </View>
        {/* <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => Alert.alert('Settings', 'Would open detailed settings')}
        >
          <MaterialIcons name="settings" size={24} color="white" />
        </TouchableOpacity> */}
      </View>

      {/* Camera View */}
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      
      {/* Bottom Navigation */}
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
          style={[styles.addButton, styles.activeNavItem]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  logo: {
    width: 40,
    height: 40,
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
  
  // Bottom Navigation styles - consistent with ProfileScreen
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.8)',
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
});

export default CameraPage;