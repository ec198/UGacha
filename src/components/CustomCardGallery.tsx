import { useEffect, useState } from 'react';
import Image from 'next/image';
import placeCard from '@/assets/cardTemplates/place-card.png';

type CustomCard = {
  _id: string;
  name: string;
  type: string;
  ability: string;
  power: string;
  description: string;
  imageUrl: string;
};

const CustomCardGallery = () => {
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [formData, setFormData] = useState<CustomCard>({
    _id: '',
    name: '',
    type: '',
    ability: '',
    power: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (editingCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingCard]);
  
  
  useEffect(() => {
    const fetchCustomCards = async () => {
      try {
        const res = await fetch('/api/customcards');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch custom cards');

        setCustomCards(data);
      } catch (err) {
        console.error('Error fetching custom cards:', err);
      }
    };

    fetchCustomCards();
  }, []);

  // Handle when the user clicks a card
  const handleEditClick = (card: CustomCard) => {
    setEditingCard(card);
    setFormData(card); 
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission to update card
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const res = await fetch('/api/customcards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Failed to update custom card');

      // Update the card in the list
      setCustomCards((prev) =>
        prev.map((card) =>
          card._id === formData._id ? { ...card, ...formData } : card
        )
      );

      setEditingCard(null); // Close the form
    } catch (err) {
      console.error('Error updating card:', err);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Custom Cards Made by All Users
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {customCards.map((card) => (
          <div
            key={card._id}
            className="relative w-[250px] h-[380px] rounded-xl overflow-hidden shadow-lg cursor-pointer"
            onClick={() => handleEditClick(card)} // Trigger edit click
          >
            <Image
              src={placeCard}
              alt="Card Background"
              fill
              className="absolute inset-0 object-cover z-0"
            />

            <div className="relative z-10 p-4 bg-white/90 text-black h-full space-y-2 text-sm">
              <div className="w-full h-[120px] overflow-hidden rounded">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold">{card.name}</h2>
              <p><strong>Type:</strong> {card.type}</p>
              <p><strong>Ability:</strong> {card.ability}</p>
              <p><strong>Power:</strong> {card.power}</p>
              <p className="italic text-xs text-gray-700">"{card.description}"</p>
            </div>
          </div>
        ))}
      </div>

      {editingCard && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 popup-background z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] sm:w-[400px] max-h-[90%] overflow-auto popup-form z-50">

            <h3 className="text-2xl font-bold text-center mb-4">Edit Card</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold">Card Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Card Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold">Card Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Card Type"
                  required
                />
              </div>

              <div>
                <label htmlFor="ability" className="block text-sm font-semibold">Ability</label>
                <input
                  type="text"
                  name="ability"
                  value={formData.ability}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Ability"
                  required
                />
              </div>

              <div>
                <label htmlFor="power" className="block text-sm font-semibold">Power</label>
                <input
                  type="text"
                  name="power"
                  value={formData.power}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Power"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Card Description"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-semibold">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Image URL"
                  required
                />
              </div>


              <div className="flex justify-center space-x-4 mt-4">
                <button
                  type="button"
                  className="py-2 px-4 bg-gray-300 rounded text-sm"
                  onClick={() => setEditingCard(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded text-sm"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="py-2 px-4 bg-red-600 text-white rounded text-sm"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this card?')) {
                      try {
                        const res = await fetch(`/api/customcards/${formData._id}`, {
                          method: 'DELETE',
                        });

                        if (!res.ok) {
                          const error = await res.json();
                          throw new Error(error.error || 'Failed to delete card');
                        }

                        // Remove deleted card from state
                        setCustomCards((prev) =>
                          prev.filter((card) => card._id !== formData._id)
                        );

                        setEditingCard(null);
                      } catch (err) {
                        console.error('Error deleting card:', err);
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCardGallery;
