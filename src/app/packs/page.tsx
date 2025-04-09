import CardGallery from '@/components/CardGallery';
import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Card = {
  _id: string;
  name: string;
  imageUrl: string;
  description?: string;
  rarity: string;
  power?: number;
};

const getCards = async (): Promise<Card[]> => {
  const db = await connectDB();
  const cards = await db.collection('trainingCard').find({}).toArray();

  return cards.map((card) => ({
    _id: (card._id as ObjectId).toString(),
    name: card.name || 'Unnamed Card',
    imageUrl: card.imageURL || card.imageUrl || '',
    description: card.description || '',
    rarity: card.rarity || 'common',
    power: card.power || undefined,
  }));
};

const PacksPage = async () => {
  const items = await getCards();

  return (
    <div className="w-full min-h-screen relative">
      <Image
        src={pinkBackground}
        alt="Pink Background"
        fill
        className="absolute inset-0 object-cover -z-10"
      />
      <div className="relative z-10 p-6">
        <h1 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-lg">
          Opened Packs
        </h1>
        <CardGallery items={items} />
      </div>
    </div>
  );
};

export default PacksPage;
