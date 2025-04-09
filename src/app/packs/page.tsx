import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';
import CardGallery from '../../components/CardGallery';
// /components/CardGallery'; 
// // adjust path if needed

const Packs = () => {
  return (
    <div className="w-full min-h-screen relative">
      {/* Background Image */}
      <Image
        src={pinkBackground}
        alt="Pink Background"
        fill
        className="absolute inset-0 object-cover"
      />



      {/* Page Content */}
      <div className="relative z-10 p-6">
        <h1 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-lg">
          Opened Packs
        </h1>
        <CardGallery />
      </div>
    </div>
  );
};

export default Packs;
// 'use client';

// import Image from 'next/image';
// import pinkBackground from '@/assets/pink-background.jpg';
// import CardGallery from '@/components/CardGallery';

// const Packs = () => {
//   return (
//     <div className="w-full min-h-screen relative">
//       <Image
//         src={pinkBackground}
//         alt="Pink Background"
//         fill
//         className="absolute inset-0 object-cover -z-10"
//       />

//       <div className="relative z-10 p-6">
//         <h1 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-lg">
//           Opened Packs
//         </h1>
//         <CardGallery />
//       </div>
//     </div>
//   );
// };

// export default Packs;
