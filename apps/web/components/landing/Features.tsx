'use client';

import { Card, Carousel } from '@/components/ui/apple-cards-carousel';

const data = [
  {
    category: 'Security',
    title: 'Your data is safe and encrypted.',
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Open Source',
    title: 'Fully open source and transparent.',
    src: 'https://images.unsplash.com/photo-1617609277590-ec2d145ca13b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Real-time',
    title: 'Instant location sharing and tracking.',
    src: 'https://images.unsplash.com/photo-1586449480584-34302e933441?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Cross-platform',
    title: 'Works on iOS, Android and Web.',
    src: 'https://images.unsplash.com/photo-1662211268181-b858b715dec9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Privacy',
    title: 'Your data is never sold or shared.',
    src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Easy to Use',
    title: 'Simple interface, easy setup.',
    src: 'https://images.unsplash.com/photo-1489506020498-e6c1cc350f10?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const Features = () => {
  const cards = data.map((card) => <Card key={card.src} card={card} />);

  return (
    <section id="features">
      <div className="h-full w-full bg-linear-to-b from-[#FAFAFA] to-white py-10 md:py-16 dark:from-[#18181B] dark:to-black">
        <h2 className="mx-auto max-w-7xl pl-4 text-xl font-bold text-neutral-800 md:text-5xl dark:text-neutral-200">
          Introducing Locatr
        </h2>
        <Carousel items={cards} />
      </div>
    </section>
  );
};

export default Features;
