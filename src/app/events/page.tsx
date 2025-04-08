'use client';

import dynamic from 'next/dynamic';

const EventsMap = dynamic(() => import('./EventsMap'), {
  ssr: false,
});

const Events = () => {
  return <EventsMap />;
};

export default Events;
