import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapAutoFocus = ({ places }) => {
  const map = useMap();
  useEffect(() => {
    if (!places || places.length === 0) return;
    if (places.length === 1) {
      map.setView([parseFloat(places[0].latitude), parseFloat(places[0].longitude)], 14, { animate: true });
    } else {
      const bounds = L.latLngBounds(places.map(p => [parseFloat(p.latitude), parseFloat(p.longitude)]));
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [places, map]);
  return null;
};

const MapView = ({ places = [] }) => {
  const defaultCenter = [26.9837, 94.6335]; 
  const validPlaces = places.filter(p => p.latitude && p.longitude);

  return (
    // Responsive Height: 300px on mobile, 500px on desktop
    // Responsive Border Radius: rounded-2xl on mobile, rounded-[2.5rem] on desktop
    <div className="w-full h-[300px] md:h-[500px] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-[var(--color-sapling-200)] shadow-xl relative z-0">
      <MapContainer center={defaultCenter} zoom={10} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPlaces.length > 0 && <MapAutoFocus places={validPlaces} />}
        {validPlaces.map((place) => (
          <Marker key={place._id || place.id} position={[parseFloat(place.latitude), parseFloat(place.longitude)]}>
            <Popup className="custom-popup">
              <div className="min-w-[160px] md:min-w-[200px]">
                <h3 className="font-bold text-sm md:text-base">{place.name}</h3>
                <Link to={`/place/${place._id || place.id}`}>
                  <button className="mt-2 w-full py-1.5 bg-[var(--color-darkblue-600)] text-white text-xs font-bold rounded shadow-sm hover:bg-[var(--color-darkblue-700)]">
                    Explore
                  </button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;