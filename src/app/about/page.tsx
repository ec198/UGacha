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
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        <div className="bg-white bg-opacity-70 p-8 rounded-lg max-w-2xl">
          <h1 className="text-3xl font-bold mb-4 text-black">About UGacha</h1>
          <p className="text-lg text-black">
            UGacha is a collectible card game experience where players can open virtual packs and collect unique cards based on the University of Georgia community. To earn packs you have to go to locations across the university depending on daily events. This could be connected to the university's events with the help of the event leaders. If an event were to tell us its time and location ahead of time, we could provide provide all of our users that go to the event a pack to reward them. The point of this is to encourage people to go to more events as well as encouraging them to spend more time outside and on campus.
          </p>
          &nbsp;
          <p className="text-lg text-black">
            Our team consist of Aiden, Elaine, Henry, and Richard. Richard is our team leader, Aiden is the Miro Board Captain, Elaine is our Github captain, and Henry is our communication's expert. All of our cards were designed individually by us. Every ultra-rare version of the card is a hand drawn full art card. 
          </p> 
        </div>
      </div>
    </div>
  );
};

export default About;
