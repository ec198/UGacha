const CardInv = ({ cards }) => {
    if (!cards || cards.length === 0) {
      return <p className="text-white text-center">No cards in inventory.</p>;
    }
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div
            key={card._id}
            className={`bg-white rounded-xl shadow-lg p-4 ${
              card.rarity === "common" ? "border-1 border-black" : 
              card.rarity === "rare" ? "border-4 border-red-500" : 
              card.rarity === "ultraRare" ? "border-4 border-yellow-500" : 
              ""
            }`}
          >
            <img src={card.imageUrl} alt={card.name} className="w-full h-auto rounded" />
            <h2 className="text-center mt-2 font-semibold text-black">{card.name}</h2>
  
            <p
              className={`text-center ${
                card.rarity === "common"
                  ? "text-gray-500"
                  : card.rarity === "rare"
                  ? "text-red-500"
                  : card.rarity === "ultraRare"
                  ? "text-yellow-500"
                  : "text-gray-500" // fallback if rarity is undefined or something else
              }`}
            >
              {card.rarity === "ultraRare" ? "Ultra Rare" : 
               card.rarity === "rare" ? "Rare" : 
               card.rarity === "common" ? "Common" : card.rarity}
            </p>
  
            <p className="text-center text-gray-500">x{card.count}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default CardInv;
  