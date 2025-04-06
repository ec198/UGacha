'use client';

import { useParams } from 'next/navigation';
import UGAitems from '@/components/UGAitems.json';
import bgarch from '@/assets/pink-background.jpg'; // 👈 Background image

const ItemPage = () => {
  const { _id } = useParams();

  const item = UGAitems.find((item) => String(item._id) === _id);

  if (!item) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgarch.src})` }}
      >
        <div className="text-red-600 font-semibold bg-white bg-opacity-90 px-4 py-2 rounded shadow">
          Item not found
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgarch.src})` }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="w-3/4 h-auto mx-auto p-6 rounded-lg">
          <h2 className="text-black text-3xl font-bold mb-4">{item.title}</h2>
          <img src={item.url} alt={item.title} className="w-auto h-3/4 mx-auto" />
          <p className="text-black mt-4">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
