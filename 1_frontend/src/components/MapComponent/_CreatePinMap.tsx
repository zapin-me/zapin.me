import React from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { LatLng, icon } from "leaflet";

const customIcon = icon({
  iconUrl: "./map-pin-check-inside.svg",
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ClickableMap({
  setMarker,
  setCenter,
}: {
  setMarker:
    | React.Dispatch<React.SetStateAction<LatLng>>
    | ((value: LatLng) => void);
  setCenter: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
}) {
  useMapEvents({
    click: (e) => {
      setMarker(e.latlng);
      setCenter(e.latlng);
    },
  });

  return null;
}

const CreatePinMap = ({
  marker,
  center = new LatLng(0, 0),
  setMarker,
  setCenter,
}: {
  marker: LatLng | undefined;
  center?: LatLng;
  setMarker: any;
  setCenter: any;
}) => (
  <div className="h-full w-full md:w-[600px] pb-2">
    <MapContainer
      center={center}
      zoom={3}
      minZoom={3}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      worldCopyJump={true}
      style={{
        borderRadius: "6px",
        overflow: "hidden",
        height: "275px",
        width: "100%",
        zIndex: 0,
      }}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />{" "}
      {marker && <Marker position={marker} icon={customIcon} />}
      <ClickableMap setMarker={setMarker} setCenter={setCenter} />
    </MapContainer>
    <div className="text-center p-2 text-indigo-200 text-sm">
      Click on the map to set the location
    </div>
  </div>
);

export default CreatePinMap;
