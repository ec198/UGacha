'use client';

interface WelcomeProps {
  onViewItems: () => void;
}

const Welcome = ({ onViewItems }: WelcomeProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-4xl font-bold z-10 space-y-6">
      <button
        onClick={onViewItems} // Use the onViewItems function passed as a prop
        className="px-6 py-3 text-lg font-semibold bg-white text-black rounded-md hover:bg-gray-300 transition"
      >
        
      </button>
    </div>
  );
};

export default Welcome;
