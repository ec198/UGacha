'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';
import defaultIcon from '@/assets/image.png'; // Custom marker icon
import placeCard from '@/assets/cardTemplates/place-card.png';


const defaultPosition = {
  lat: 33.94266362958919,
  lng: -83.3724628665098,
};

const cardIcon = new L.Icon({
  iconUrl: placeCard.src, // if imported
  // iconUrl: placeCard, // if using string path like "/place-card.png"
  iconSize: [60, 84],      // tweak size as needed
  iconAnchor: [30, 42],
  popupAnchor: [0, -40],
  className: '',
});

const EventsMap = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [missionProgress, setMissionProgress] = useState<{
    visited: string[]; // or use location.name if no id
    total: number;
  }>({
    visited: [],
    total: 2,
  });
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    ability: '',
    power: '',
    description: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [customCards, setCustomCards] = useState<any[]>([]);

  // Fetch random location cards
  useEffect(() => {
    fetch('/api/locationcards')
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setLocations(shuffled.slice(0, 2));
      })
      .catch((err) => console.error('Failed to fetch location cards:', err));
  }, []);

  // Watch user location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  useEffect(() => {
    if (userLocation && locations.length === 2) {
      const newlyVisited = locations
        .filter((location) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            location.latitude,
            location.longitude
          );
          return distance <= 0.1;
        })
        .map((loc) => loc.name); // use loc.id if available
  
      setMissionProgress((prev) => ({
        ...prev,
        visited: Array.from(new Set([...prev.visited, ...newlyVisited])),
      }));
    }
  }, [userLocation, locations]);
  

  const createCustomIcon = () =>
    new L.Icon({
      iconUrl: defaultIcon.src,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: 'user-marker-icon',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const newCard = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };
  
    setCustomCards((prev) => [...prev, newCard]);
  
    setFormData({
      name: '',
      type: '',
      ability: '',
      power: '',
      description: '',
      latitude: '',
      longitude: '',
      imageUrl: '',
    });
  
    setShowForm(false);
  };
  
  return (
    <div className="w-full h-screen relative">
      <Image
        src={pinkBackground}
        alt="Pink Background"
        fill
        className="absolute inset-0 object-cover"
      />

      {/* Sidebar */}
      <div className="absolute top-4 left-1/4 transform -translate-x- sm:left-4 sm:translate-x-0 z-20 w-[55%] sm:w-[300px] p-3 sm:p-4 bg-white rounded-xl shadow-md space-y-3 max-h-[60vh] sm:max-h-[90vh] overflow-y-auto text-sm">




        {/* Daily Mission UI */}
        <div>
          <h3 className="font-bold text-xl text-center mb-2">Daily Mission</h3>
          <p className="text-sm text-center mb-4">
            Go to the locations of the two cards to complete the mission!
          </p>

          <ul className="space-y-2">
  {locations.map((location, index) => {
    const isVisited = missionProgress.visited.includes(location.name); // or location.id
    return (
      <li key={location.name} className="text-sm">
        {location.name} -{' '}
        <span className={isVisited ? 'text-green-500' : 'text-red-500'}>
          {isVisited ? 'Visited' : 'Not Visited'}
        </span>
      </li>
    );
  })}
</ul>

          <div className="mt-4">
            <p className="text-center font-semibold">
              {missionProgress.visited}/{missionProgress.total} Locations Visited
            </p>
            <progress
              value={missionProgress.visited}
              max={missionProgress.total}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Add Card Form */}
        {/* Add Card Form - Toggleable */}
<div>
  <button
    className="bg-pink-500 text-white rounded p-2 w-full"
    onClick={() => setShowForm((prev) => !prev)}
  >
    {showForm ? 'Close Form' : 'Add a Card'}
  </button>

  {showForm && (
    <div className="mt-4 transition-all duration-300 ease-in-out">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          name="name"
          placeholder="Name"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          name="type"
          placeholder="Type"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.type}
          required
        />
        <input
          name="ability"
          placeholder="Ability"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.ability}
          required
        />
        <input
          name="power"
          placeholder="Power"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.power}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.description}
          required
        />
        <input
          name="latitude"
          placeholder="Latitude"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.latitude}
          required
        />
        <input
          name="longitude"
          placeholder="Longitude"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.longitude}
          required
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          className="text-black border p-2 rounded"
          onChange={handleChange}
          value={formData.imageUrl}
          required
        />
        <button type="submit" className="bg-pink-500 text-white rounded p-2">
          Create Marker
        </button>
      </form>
    </div>
  )}
</div>

      </div>

      {/* Map */}
      <div className="absolute inset-0 z-10">
        <MapContainer center={defaultPosition} zoom={13} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {locations.map((location, index) => (
            <Marker
            key={location.name} // or location.id if exists
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon()}
          />
          ))}
          {customCards.map((card, index) => (
  <Marker
    key={card.id || `${card.name}-${index}`} // fallback to unique combo
    position={[card.latitude, card.longitude]} icon={cardIcon}
  >
  <Popup>
    <div className="relative w-[250px] h-[380px] overflow-hidden rounded-lg shadow-lg text-white">
      {/* Background image covering full card */}
      <img
        src={placeCard.src}
        alt="Card Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Content overlay */}
      <div className="w-[250px] p-4 bg-white rounded-xl shadow-lg text-black space-y-3 text-sm">
  {/* Image */}
  <div className="w-full h-[120px] overflow-hidden rounded">
    <img
      src={card.imageUrl}
      alt={card.name}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Text Info */}
  <div className="space-y-1">
    <h2 className="text-lg font-bold">{card.name}</h2>
    <p><span className="font-semibold">Type:</span> {card.type}</p>
    <p><span className="font-semibold">Ability:</span> {card.ability}</p>
    <p><span className="font-semibold">Power:</span> {card.power}</p>
  </div>

  {/* Description */}
  <p className="italic text-xs text-gray-600">"{card.description}"</p>

  {/* Optional footer or tag/icons can go here */}
</div>

    </div>
  </Popup>
</Marker>
))}


          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
              interactive={false}
              keyboard={false}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default EventsMap;

