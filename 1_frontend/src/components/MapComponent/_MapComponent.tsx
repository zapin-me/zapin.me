import React, { useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Zap } from "lucide-react";
import { icon } from "leaflet";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const customIcon = icon({
  iconUrl: "./map-pin-check-inside.svg",
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const calculateTimeLeft = (timestamp: string): TimeLeft => {
  const now = new Date().getTime();
  const deactivateTime = parseInt(timestamp) * 1000;
  const difference = deactivateTime - now;

  let timeLeft = {} as TimeLeft;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return timeLeft;
};

const useCountdown = (timestamp: string, onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(timestamp));

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(timestamp);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timestamp, timeLeft, onComplete]);

  return timeLeft;
};

const formatTimeLeft = (timeLeft: any) => {
  let formattedTime = "";

  if (timeLeft.days > 0) {
    formattedTime += `${timeLeft.days}d `;
  }
  if (timeLeft.hours > 0 || timeLeft.days > 0) {
    formattedTime += `${timeLeft.hours}h `;
  }
  if (timeLeft.minutes > 0 || timeLeft.hours > 0 || timeLeft.days > 0) {
    formattedTime += `${timeLeft.minutes}m `;
  }
  formattedTime += `${timeLeft.seconds}s`;

  return formattedTime.trim();
};

const MarkerPopup = ({
  marker,
  onRemove,
}: {
  marker: any;
  onRemove: () => void;
}) => {
  const timeLeft = useCountdown(marker.deactivate_at, onRemove);

  return (
    <Popup>
      <div className="relative px-6 py-1 bg-indigo-800 text-white rounded-lg shadow-md w-full min-w-[250px]">
        <div className="flex items-center mb-0">
          <Zap className="w-4 h-4 text-yellow-500 mr-1" />
          <p className="text-sm text-yellow-500 font-semibold">
            {marker.amount}
          </p>
        </div>

        <h2 className="text-[18px] font-medium text-white mb-0">
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

const Map = ({
  markers,
  setMarkers,
  fetchTotalPins,
}: {
  markers: {
    amount: number;
    deactivate_at: string;
    lat_long: string;
    message: string;
    updated_at: string;
  }[];
  fetchTotalPins: () => void;
  setMarkers: any;
}) => {
  const handleRemoveMarker = async (index: number) => {
    setMarkers((prevMarkers: any[]) =>
      prevMarkers.filter((_: any, i: number) => i !== index)
    );
    fetchTotalPins();
  };

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[20, 0]}
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
        {markers.map((marker, index) => {
          const lat = parseFloat(marker.lat_long.split(",")[0]);
          const long = parseFloat(marker.lat_long.split(",")[1]);

          return (
            <Marker key={index} position={[lat, long]} icon={customIcon}>
              <MarkerPopup
                marker={marker}
                onRemove={() => handleRemoveMarker(index)}
              />
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
