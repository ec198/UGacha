// Item.tsx

interface ItemProps {
    item: {
      _id: number;
      title: string;
      description: string;
      url: string;
    };
  }
  
  const Item = ({ item }: ItemProps) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img src={item.url} alt={item.title} className="w-full h-48 object-cover rounded-md mb-4" />
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className="text-gray-600">{item.description}</p>
      </div>
    );
  };
  
  export default Item;
  