import Item from "@/components/Item";

interface ItemType {
  _id: number;
  owner: number;
  title: string;
  description: string;
  url: string;
}

interface ItemsProps {
  items: ItemType[];
}

const Items = ({ items }: ItemsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item._id} className="bg-white border shadow-lg p-4 rounded-lg h-[450px] w-[250px]"> 
          {/* Adjusting the card to a fixed height and width */}
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-[300px] object-cover rounded-md"
            // Adjusted height for image to make it taller
          />
          <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Items;
