import {
  IconBolt,
  IconCode,
  IconDevices,
  IconEye,
  IconHeart,
  IconShield,
} from '@tabler/icons-react';

import { BentoGrid, BentoGridItem } from '../ui/bento-grid';

const Header = ({ icon }: { icon: React.ReactNode }) => (
  <div className="h-full min-h-32 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
    {icon}
  </div>
);

const items = [
  {
    title: 'Privacy First',
    description:
      'Your location data stays yours. End-to-end encryption ensures complete privacy and security.',
    header: <Header icon={<IconShield className="h-12 w-12 text-neutral-500" />} />,
  },
  {
    title: 'Open Source Transparency',
    description:
      'Full transparency with open source code. Audit, contribute, and trust the technology you use.',
    header: <Header icon={<IconCode className="h-12 w-12 text-neutral-500" />} />,
  },
  {
    title: 'Lightning Fast',
    description:
      'Real-time location updates with minimal battery drain. Optimized for performance and efficiency.',
    header: <Header icon={<IconBolt className="h-12 w-12 text-neutral-500" />} />,
  },
  {
    title: 'Works Everywhere',
    description:
      'Cross-platform compatibility across iOS, Android, and Web. One app, all your devices.',
    header: <Header icon={<IconDevices className="h-12 w-12 text-neutral-500" />} />,
  },
  {
    title: 'No Data Mining',
    description:
      'We never sell, share, or monetize your personal data. Your privacy is our commitment.',
    header: <Header icon={<IconEye className="h-12 w-12 text-neutral-500" />} />,
  },
  {
    title: 'Built with Care',
    description:
      'Designed by users, for users. Simple interface with powerful features that just work.',
    header: <Header icon={<IconHeart className="h-12 w-12 text-neutral-500" />} />,
  },
];

const WhyLocatr = () => {
  return (
    <section id="why-locatr">
      <div className="h-full w-full px-4 py-10 sm:px-6 md:py-16 lg:px-0">
        <h2 className="mx-auto mb-16 max-w-7xl pl-4 text-xl font-bold text-neutral-800 md:text-5xl dark:text-neutral-200">
          Why Locatr?
        </h2>

        <BentoGrid className="mx-auto max-w-7xl">
          {items.map((item, index) => (
            <BentoGridItem
              key={index}
              title={item.title}
              description={item.description}
              header={item.header}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default WhyLocatr;
