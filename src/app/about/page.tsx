// app/about/page.tsx
import Image from 'next/image';
import pinkBackground from '@/assets/pink-background.jpg';

const About = () => {
  return (
    <div className="w-full h-screen relative">
      <Image
        src={pinkBackground}
        alt="Pink Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
      />
    </div>
  );
};

export default About;
