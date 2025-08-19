import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import { SightingsController } from '../controllers/SightingsController';

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
  const [currentPosition, setCurrentPosition] = useState(null);  // user current location
  const defaultPosition = [-25.8812222, 28.291611111111113]; // fallback location
  
  const [sightings, setSightings] = useState([]);

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
      console.log(response);
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
    console.log(sightings);
  }, []);

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
          <Marker position={[entry.geolocation_lat, entry.geolocation_long]}/>
        ))}

        {/* Default location marker */}
        <Marker position={defaultPosition} />

        {/* User location marker */}
        {currentPosition && <Marker position={currentPosition} icon={userIcon} />}

        {/* Recenter when user position updates */}
        <RecenterMap position={currentPosition} />
      </MapContainer>
    </Container>
  );
};

export default MapPage;
