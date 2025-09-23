"use client";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  position: [number, number];
  onMarkerChange: (lat: number, lng: number) => void;
}

const MapEvents = ({
  onMarkerChange,
}: {
  onMarkerChange: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onMarkerChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent = ({ position, onMarkerChange }: MapComponentProps) => {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      // style={{ height: "500px", width: "100%" }}
      className="w-full h-52"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Lokasi Toko</Popup>
      </Marker>
      <MapEvents onMarkerChange={onMarkerChange} />
    </MapContainer>
  );
};

export default MapComponent;
