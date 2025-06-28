import { Marquee as UIMarquee } from '../ui/marquee';
import ReviewCard from './ReviewCard';

const reviews = [
  {
    name: 'Ahmet',
    username: '@ahmet',
    body: 'Finally a location app I can trust!',
    img: 'https://avatar.vercel.sh/ahmet',
  },
  {
    name: 'Zeynep',
    username: '@zeynep',
    body: 'Real-time tracking is incredibly accurate.',
    img: 'https://avatar.vercel.sh/zeynep',
  },
  {
    name: 'Mehmet',
    username: '@mehmet',
    body: "Love that my data isn't being sold to third parties.",
    img: 'https://avatar.vercel.sh/mehmet',
  },
  {
    name: 'Ayşe',
    username: '@ayse',
    body: 'Cross-platform support is amazing!',
    img: 'https://avatar.vercel.sh/ayse',
  },
  {
    name: 'Emre',
    username: '@emre',
    body: 'Setup was incredibly easy.',
    img: 'https://avatar.vercel.sh/emre',
  },
  {
    name: 'Fatma',
    username: '@fatma',
    body: 'The encryption gives me confidence.',
    img: 'https://avatar.vercel.sh/fatma',
  },
];

export function Marquee() {
  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <UIMarquee pauseOnHover className="[--duration:25s] mb-4">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </UIMarquee>
      <UIMarquee reverse pauseOnHover className="[--duration:25s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </UIMarquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
