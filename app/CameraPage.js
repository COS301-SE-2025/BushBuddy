import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Animated, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CameraPage = () => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState('camera');
  const [lastPhoto, setLastPhoto] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const flashAnimation = useRef(new Animated.Value(0)).current;

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

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        
        // Snapchat-style flash animation
        Animated.sequence([
          Animated.timing(flashAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnimation, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: true,
        });
        
        // Save the last photo for thumbnail preview
        setLastPhoto(photo.uri);
        
        // Here you can handle the captured photo
        console.log('Photo captured:', photo.uri);
        
        // Optional: Show success feedback
        // Alert.alert('Photo Captured!', 'Snap saved!');
        
        // Navigate to a preview screen or save the photo
        // navigation.navigate('PhotoPreview', { photoUri: photo.uri });
        
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // Navigation handlers
  const handleNavigation = (screen, tab) => {
    navigation.navigate(screen);
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Beast Scanner</Text>
        </View>
      </View>

      {/* Camera View */}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          {/* Flash Overlay(cool like snapchat) */}
          <Animated.View 
            style={[
              styles.flashOverlay,
              {
                opacity: flashAnimation,
              }
            ]} 
            pointerEvents="none"
          />

          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.cameraControls}>
            <View style={styles.captureContainer}>
              {/* Last Photo Thumbnail will add more detail later on*/}
              <TouchableOpacity 
                style={styles.thumbnailContainer}
                onPress={() => lastPhoto && Alert.alert('Last Photo', 'View your last snap!')}
              >
                {lastPhoto ? (
                  <Image source={{ uri: lastPhoto }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.emptyThumbnail}>
                    <MaterialIcons name="photo" size={20} color="#666" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity 
                style={[
                  styles.captureButton,
                  isCapturing && styles.captureButtonPressed
                ]} 
                onPress={takePicture}
                disabled={isCapturing}
              >
                <View style={[
                  styles.captureButtonInner,
                  isCapturing && styles.captureButtonInnerPressed
                ]} />
              </TouchableOpacity>

              {/* Placeholder for right side balance */}
              <View style={styles.thumbnailContainer} />
            </View>
          </View>
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
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 10,
  },
  topControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  emptyThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    transition: 'all 0.1s ease',
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  captureButtonInnerPressed: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 0.9 }],
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Bottom Navigation styles
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