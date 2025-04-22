const CardInv = ({ cards }) => {
    if (!cards || cards.length === 0) {
      return <p className="text-white text-center">No cards in inventory.</p>;
    }
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card._id} className="bg-white rounded-xl shadow-lg p-4">
            <img src={card.imageUrl} alt={card.name} className="w-full h-auto rounded text-black" />
            <h2 className="text-center mt-2 font-semibold">{card.name}</h2>
            <p className="text-center text-gray-500">x{card.count}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default CardInv;
  