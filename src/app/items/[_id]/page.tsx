"use client"
// app/items/[id]/page.tsx
import { useParams } from 'next/navigation'; // Use useParams instead of useRouter
import UGAitems from '@/components/UGAitems.json';

const ItemPage = () => {
  const { _id } = useParams(); // useParams provides dynamic URL parameters
  
  

  // Find the item that matches the id
  const item = UGAitems.find((item) => String(item._id) === _id);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
        <img src={item.url} alt={item.title} className="w-3/4 h-auto mx-auto" />
        <p className="mt-4">{item.description}</p>
      </div>
    </div>
  );
};

export default ItemPage;
