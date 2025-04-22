const CardInv = ({ cards }) => {
    if (!cards || cards.length === 0) {
      return <p className="text-black text-center">There are currently no cards in inventory.</p>;
    }
  
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6"> {/* Increase gap between the cards */}
        {cards.map(card => (
          <div
            key={card._id}
            className={`bg-white rounded-xl shadow-lg p-6 ${ // Add more padding to the card itself
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
                  ? "text-gray-400"
                  : card.rarity === "rare"
                  ? "text-red-500"
                  : card.rarity === "ultraRare"
                  ? "text-yellow-500"
                  : "text-gray-500" // default color if none of the rarities above
              }`}
            >
              {card.rarity === "ultraRare" ? "Ultra Rare" : 
               card.rarity === "rare" ? "Rare" : 
               card.rarity === "common" ? "Common" : card.rarity}
            </p>
  
            <p className="text-center text-gray-700">x{card.count}</p>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
          <div className="w-[90vw] max-w-md bg-white border border-gray-300 rounded-xl shadow-xl p-6 relative pointer-events-auto">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-2 right-2 bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-black text-2xl font-bold mb-4 text-center">{selectedCard.name}</h2>
            <Image
              src={selectedCard.imageUrl}
              alt={selectedCard.name}
              width={300}
              height={450}
              className="mx-auto rounded-xl"
            />
            <p className="text-black mt-4 text-center">{selectedCard.description}</p>
            <p className="text-black font-semibold mt-2 text-center">
              Rarity:{' '}
              <span className={rarityColors[selectedCard.rarity]}>
                {rarityLabels[selectedCard.rarity]}
              </span>
            </p>
            <p className="text-black font-semibold mt-1 text-center">
              You own: x{selectedCard.count}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CardInv;
