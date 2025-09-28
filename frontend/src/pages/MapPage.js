import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import { SightingsController } from '../controllers/SightingsController';
import PostDetailModal from '../components/PostDetailModal'; // Import the modal

const userIcon = L.icon({
  iconUrl: require("../assets/user-location.png"),
  iconSize: [36, 36],
  iconAnchor: [16, 36],
  popupAnchor: [0, -36]
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);
  return null;
}

const MapPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null); // User's current location
  const [recenterPosition, setRecenterPosition] = useState(null); //recenter on point
  const defaultPosition = [-25.8812222, 28.291611111111113]; // Fallback location
  const [sightings, setSightings] = useState([]); // List of all sightings
  const [selectedSighting, setSelectedSighting] = useState(null); // Data for the clicked marker
  const [modalData, setModalData] = useState(null); // Data for modal visibility
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [showFailPopup, setShowFailPopup] = useState(false);

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  useEffect(() => {
    //fetch sightings
    const fetchSightings = async () => {
      const response = await SightingsController.handleFetchAllSightings();
      if (response.success) {
        setSightings(response.result.sightings);
      } else {
        console.error(response.message);
      }
    };

    // Request user location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }

    fetchSightings();
  }, []);

  // Function to fetch detailed data for a specific sighting
  const fetchSightingDetails = async (sightingId) => {
    try {
      const response = await SightingsController.handleFetchSightingDetails(sightingId);
      if (response.success) {
        setSelectedSighting(response.data);
        setRecenterPosition([response.data.geolocation_lat, response.data.geolocation_long]);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching sighting details:", error);
    }
  };

  const fetchPostDetails = async (sightingId) => {
    try {
      const response = await SightingsController.handleFetchPostDetails(sightingId);
      if (response.success) {
        setModalData(response.data);
        setModalVisible(true);
      } else {
        setShowFailPopup(true);
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  return (
    <Container className="map-page">
      <MapContainer
        center={defaultPosition}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Normal">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {sightings.map((entry) => (
          <Marker
            key={entry.id} // Ensure each marker has a unique key
            position={[entry.geolocation_lat, entry.geolocation_long]}
            eventHandlers={{
              click: () => fetchSightingDetails(entry.id), // Fetch details when marker is clicked
            }}
          >
            <Popup className="popup">
              {selectedSighting && selectedSighting.id === entry.id ? (
                <div onClick={() => fetchPostDetails(entry.id)}>
                  <h3>{selectedSighting.animal_id}</h3>
                  <img className='popUpImg' src={selectedSighting.image_url}></img>
                  <p><b>Sighted by:</b> {selectedSighting.user_id}</p>
                  <p><b>{new Date(selectedSighting.created_at).toLocaleString()}</b></p>
                </div>
              ) : (
                <div className="pop-up-loader-wrapper">
                  <div className="pop-up-loader"></div>
                </div>
              )}
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {currentPosition && <Marker position={currentPosition} icon={userIcon} />}

        {/* Recenter when user position updates */}
        <RecenterMap position={currentPosition} />
      </MapContainer>

      {/* Render the PostDetailModal */}
      {modalVisible && modalData && (
        <PostDetailModal
          post={modalData.post}
          comments={modalData.comments || []}
          onClose={() => setModalVisible(false)}
        />
      )}

      {showFailPopup && (
        <div className="form-overlay">
          <div className="success-popup">
            <h4>No post exists for this sighting</h4>
            <button
              className="submit-button"
              onClick={() => setShowFailPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MapPage;
