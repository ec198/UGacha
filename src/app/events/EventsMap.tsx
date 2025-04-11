'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';
// import cardTemplate from '@/assets/image.png'; 
import placeTemplate from '@/assets/cardTemplates/place-card.png'
import iconTemplate from '@/assets/cardTemplates/icon-card.png';
import eventTemplate from '@/assets/cardTemplates/event-card.png';
import extracurricularTemplate from '@/assets/cardTemplates/extracurricular-card.png';
import classTemplate from '@/assets/cardTemplates/class-card.png';
import defaultTemplate from '@/assets/image.png';



const MarkerCard = ({ marker }: { marker: any }) => {
  const getBackgroundForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'place':
        return placeTemplate.src;
      case 'icon':
        return iconTemplate.src;
      case 'event':
        return eventTemplate.src;
      case 'extracurricular':
        return extracurricularTemplate.src;
      case 'class':
        return classTemplate.src;
      default:
        return defaultTemplate.src;
    }
  };

  const backgroundImage = getBackgroundForType(marker.type || '');

  return (
    <div
      className="relative w-[250px] h-[380px] text-black font-sans"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', borderRadius: '10px' }}
    >
       {/* Top Title */}
  <div className="absolute top-2 left-3 text-lg font-bold">
    {marker.name}
  </div>


  {/* Main Center Image */}
  <div className="absolute top-[50px] left-[30px] w-[200px] h-[150px] border rounded-md overflow-hidden">
    <img src={marker.imageUrl} alt="Main Visual" className="w-full h-full object-cover" />
  </div>



  {/* Attack + Power */}
  <div className="absolute top-[230px] left-4 right-4 flex justify-between items-center text-sm">
    <span>{marker.ability}</span>
    <span className="font-semibold">{marker.power}</span>
  </div>


{/* Description */}
<div className="absolute top-[300px] left-3 right-3 pr-10 text-xs italic text-gray-700 whitespace-pre-wrap text-right">
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
    power: '',
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
        power: '',
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
        <input
          name="name"
          placeholder="Name"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          name="type"
          placeholder="Type"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.type}
          required
        />
        <input
          name="ability"
          placeholder="Ability"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.ability}
          required
        />
        <input
          name="power"
          placeholder="Power"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.power}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.description}
          required
        />
        <input
          name="latitude"
          placeholder="Latitude"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.latitude}
          required
        />
        <input
          name="longitude"
          placeholder="Longitude"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.longitude}
          required
        />
        <input
          name="imageUrl"
          placeholder="Image URL (for marker)"
          className="text-black placeholder-gray-600 border border-gray-300 p-2 rounded"
          onChange={handleChange}
          value={formData.imageUrl}
          required
        />
        <button type="submit" className="bg-pink-500 text-white rounded p-2">
          Create Marker
        </button>
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
