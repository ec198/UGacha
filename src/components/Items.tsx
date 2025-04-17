import Item from "@/components/Item";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";

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
  // UseMemo ensures UUIDs are stable during this render
  const itemsWithUUID = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        uuid: uuidv4(),
      })),
    [items]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {itemsWithUUID.map((item) => (
        <div
          key={item.uuid}
          className="bg-white border shadow-lg p-4 rounded-lg h-[380px] w-[250px]"
        >
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
