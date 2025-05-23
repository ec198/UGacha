import { useRef, useState, useEffect } from "react";
import Items from "@/components/Items";  
import UGAitems from "@/components/UGAitems.json";  
import CardGallery from "@/components/CardGallery";

const ItemsPage = () => {
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const itemsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateBackgroundHeight = () => {
      const backgroundElement = document.getElementById("background");
      if (backgroundElement) {
        setBackgroundHeight(backgroundElement.clientHeight);
      }
    };

    updateBackgroundHeight();
    window.addEventListener("resize", updateBackgroundHeight);
    return () => window.removeEventListener("resize", updateBackgroundHeight);
  }, []);

  const handleViewItems = () => {
    if (itemsSectionRef.current) {
      itemsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Background section */}
      <div
        id="background"
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage:
            'url("your-background-image-url.jpg")', // Replace with your actual background image
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold">Welcome to the Items Page</h1>
          <button
            onClick={handleViewItems}
            className="mt-8 px-6 py-2 text-lg bg-white text-black rounded-lg shadow-lg"
          >
            View Items
          </button>
        </div>
      </div>

      {/* Items Section */}
      <section
        ref={itemsSectionRef}
        style={{
          marginTop: `${backgroundHeight}px`,
        }}
        className="py-8 bg-gray-100"
      >
        <div className="container mx-auto px-4">
        <CardGallery />
        {/* Pass the UGAitems as props */}
        </div>
      </section>
    </div>
  );
};

export default ItemsPage;
