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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {items.map((item) => (
        <div key={item._id} className="bg-white border shadow-lg p-4 rounded-lg h-[380px] w-[250px]">
          {/* Wrap the entire item card with the <a> link */}
          <a href={`/items/${item._id}`} className="cursor-pointer block">
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-[300px]"
            />
            <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Items;
