import React, { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Link, SquareArrowOutUpRight, Zap } from "lucide-react";
import { icon } from "leaflet";
import { formatTimeLeft } from "@/Utils/formatTimeLeft";
import { useCountdown } from "@/Utils/useCountdown";

const deactivatedIcon = icon({
  iconUrl: "./map-pin-check-inside-deactivated.svg",
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const customIcon = icon({
  iconUrl: "./map-pin-check-inside.svg",
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MarkerPopup = ({
  marker,
  onRemove,
}: {
  marker: any;
  onRemove: () => void;
}) => {
  const [copied, setCopied] = React.useState(false);
  const timeLeft = useCountdown(marker.deactivate_at, onRemove);

  return (
    <Popup>
      <div className="relative px-6 py-1 bg-indigo-800 text-white rounded-lg shadow-md w-full min-w-[250px]">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-yellow-500 mr-1" />
            <p className="text-sm text-yellow-500 font-semibold">
              {marker.amount}
            </p>
          </div>
          <div className="grow" />
          <div className="relative group">
            <Link
              className="w-4 h-4 text-white cursor-pointer"
              onClick={() => {
                const url = `https://zapin.me/?pin=${marker.id}`;
                navigator.clipboard.writeText(url);
                setCopied(true);
              }}
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded px-4 py-2">
              {copied ? "Copied" : "Link"}
            </div>
          </div>
          {marker.nostr_link && (
            <div className="relative group ml-2">
              <a href={marker.nostr_link} target="_blank" rel="noreferrer">
                <SquareArrowOutUpRight className="w-4 h-4 text-white cursor-pointer" />
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded px-4 py-2">
                  Note
                </div>
              </a>
            </div>
          )}
        </div>

        <h2 className="text-[18px] font-medium text-white mb-0 break-all">
          {marker.message}
        </h2>

        <p className="text-xs text-gray-300 text-right">
          Expires in:{" "}
          <span className="font-bold text-white">
            {formatTimeLeft(timeLeft)}
          </span>
        </p>

        <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-8 border-t-indigo-800 border-x-8 border-x-transparent"></div>
      </div>
    </Popup>
  );
};

const MarkerPopupDeactivated = ({ marker }: { marker: any }) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <Popup>
      <div className="relative px-6 py-1 bg-gray-800 text-white rounded-lg shadow-md w-full min-w-[250px]">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-yellow-500 mr-1" />
            <p className="text-sm text-yellow-500 font-semibold">
              {marker.amount}
            </p>
          </div>
          <div className="grow" />
          <div className="relative group">
            <Link
              className="w-4 h-4 text-white cursor-pointer"
              onClick={() => {
                const url = `https://zapin.me/?pin=${marker.id}`;
                navigator.clipboard.writeText(url);
                setCopied(true);
              }}
            />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded px-4 py-2">
              {copied ? "Copied" : "Link"}
            </div>
          </div>
          {marker.nostr_link && (
            <div className="relative group ml-2">
              <a href={marker.nostr_link} target="_blank" rel="noreferrer">
                <SquareArrowOutUpRight className="w-4 h-4 text-white cursor-pointer" />
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs rounded px-4 py-2">
                  Note
                </div>
              </a>
            </div>
          )}
        </div>

        <h2 className="text-[18px] font-medium text-white mb-0 break-all">
          {marker.message}
        </h2>

        <p className="text-xs text-gray-300 text-right">Deactivated</p>

        <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-8 border-t-gray-800 border-x-8 border-x-transparent"></div>
      </div>
    </Popup>
  );
};

const Map = ({
  markers,
  setMarkers,
  fetchTotalPins,
  markerListDeactivated,
  setMarkerListDeactivated,
  filterType,
  onRightClick,
  activeMarkerId,
  center,
}: {
  markers: {
    id: number;
    amount: number;
    deactivate_at: string;
    lat_long: string;
    message: string;
    updated_at: string;
  }[];
  fetchTotalPins: () => void;
  setMarkers: any;
  markerListDeactivated: any;
  setMarkerListDeactivated: any;
  activeMarkerId: number;
  filterType: string[];
  onRightClick: (lat: number, long: number) => void;
  center: any;
}) => {
  const handleRemoveMarker = async (index: number) => {
    setMarkers((prevMarkers: any[]) =>
      prevMarkers.filter((_: any, i: number) => i !== index)
    );
    setMarkerListDeactivated((prevMarkers: any[]) => [
      ...prevMarkers,
      markers[index],
    ]);
    fetchTotalPins();
  };

  const MapEventsHandler = ({
    onRightClick,
  }: {
    onRightClick: (lat: number, lng: number) => void;
  }) => {
    useMapEvents({
      contextmenu(e) {
        onRightClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  // Function to determine if the marker is deactivated
  const isMarkerDeactivated = (deactivate_at: string) => {
    const currentTime = new Date().getTime();
    const deactivateTime = parseInt(deactivate_at) * 1000;
    return deactivateTime <= currentTime;
  };

  const filteredMarkers = filterType.includes("all")
    ? [...markers, ...markerListDeactivated]
    : [
        ...(filterType.includes("active") ? markers : []),
        ...(filterType.includes("deactivated") ? markerListDeactivated : []),
      ];

  return (
    <div className="h-screen w-full">
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
          height: "calc(100vh - 56px)",
          width: "100%",
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventsHandler onRightClick={onRightClick} />

        {filteredMarkers.map((marker: any, index: any) => {
          const lat = parseFloat(marker.lat_long.split(",")[0]);
          const long = parseFloat(marker.lat_long.split(",")[1]);

          const isDeactivated = isMarkerDeactivated(marker.deactivate_at);

          return (
            <Marker
              key={index}
              position={[lat, long]}
              icon={isDeactivated ? deactivatedIcon : customIcon}
              ref={(ref) => {
                if (!ref) return;
                if (marker.id === activeMarkerId) {
                  ref.openPopup();
                }
              }}
            >
              {isDeactivated ? (
                <MarkerPopupDeactivated marker={marker} />
              ) : (
                <MarkerPopup
                  marker={marker}
                  onRemove={() => handleRemoveMarker(index)}
                />
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
