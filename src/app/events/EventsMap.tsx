'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';
import cardTemplate from '@/assets/image.png'; 

const MarkerCard = ({ marker }: { marker: any }) => {
  return (
    <div
      className="relative w-[250px] h-[380px] text-black font-sans"
      style={{ backgroundImage: `url(${cardTemplate.src})`, backgroundSize: 'cover', borderRadius: '10px' }}
    >
      {/* Name - Top left */}
      <div className="absolute top-3 left-4 text-lg font-bold">{marker.name}</div>

      {/* Type - Top right circle */}
      <div className="absolute top-2 right-2 bg-white rounded-full w-[60px] h-[60px] flex items-center justify-center text-sm font-semibold shadow">
        {marker.type}
      </div>

      {/* Inserted Image - Centered */}
      <div className="absolute top-[60px] left-[20px] w-[210px] h-[120px] rounded-md overflow-hidden border border-gray-300">
        <img
          src={marker.imageUrl}
          alt="Inserted"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Ability - Bottom Left */}
      <div className="absolute top-[200px] left-4 text-sm font-semibold">
        {marker.ability}
      </div>

      {/* Description - Below Ability */}
      <div className="absolute top-[230px] left-4 right-4 text-xs italic whitespace-pre-wrap">
        {marker.description}
      </div>
    </div>
  );
};

const defaultPosition = {
  lat: 33.94266362958919,
  lng: -83.3724628665098,
};

const EventsMap = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    ability: '',
    description: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
  });

  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({ shadowUrl: '' });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkers([...markers, { ...formData, lat, lng }]);
      setFormData({
        name: '',
        type: '',
        ability: '',
        description: '',
        latitude: '',
        longitude: '',
        imageUrl: '',
      });
    }
  };

  const createCustomIcon = (url: string) =>
    new L.Icon({
      iconUrl: url,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

  return (
    <div className="w-full h-screen relative">
      <Image
        src={pinkBackground}
        alt="Pink Background"
        fill
        className="absolute inset-0 object-cover"
      />
      <div className="absolute top-4 left-4 z-20 bg-white p-4 rounded-xl shadow-md w-[300px] space-y-2 overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input name="name" placeholder="Name" onChange={handleChange} value={formData.name} required />
          <input name="type" placeholder="Type" onChange={handleChange} value={formData.type} required />
          <input name="ability" placeholder="Ability" onChange={handleChange} value={formData.ability} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} required />
          <input name="latitude" placeholder="Latitude" onChange={handleChange} value={formData.latitude} required />
          <input name="longitude" placeholder="Longitude" onChange={handleChange} value={formData.longitude} required />
          <input name="imageUrl" placeholder="Image URL (for marker)" onChange={handleChange} value={formData.imageUrl} required />
          <button type="submit" className="bg-pink-500 text-white rounded p-2">Create Marker</button>
        </form>
      </div>
      <div className="absolute inset-0 z-10">
        <MapContainer center={defaultPosition} zoom={13} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]} icon={createCustomIcon(marker.imageUrl)}>
              <Popup>
                <MarkerCard marker={marker} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default EventsMap;
