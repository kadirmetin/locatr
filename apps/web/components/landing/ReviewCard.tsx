import Image from 'next/image';

interface ReviewCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
}

const ReviewCard = ({ img, name, username, body }: ReviewCardProps) => {
  return (
    <figure className="relative w-80 cursor-pointer overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-slate-300/50 hover:bg-white/80 hover:shadow-lg hover:shadow-slate-200/20 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-slate-700/50 dark:hover:bg-slate-900/80 dark:hover:shadow-slate-900/20">
      <div className="flex items-center gap-4">
        <Image
          width={48}
          height={48}
          alt={`${name}'s avatar`}
          src={img}
          className="rounded-full ring-2 ring-slate-200/50 dark:ring-slate-800/50"
        />
        <div>
          <figcaption className="font-semibold text-slate-900 dark:text-slate-100">
            {name}
          </figcaption>
          <p className="text-sm text-slate-500 dark:text-slate-400">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {body}
      </blockquote>
    </figure>
  );
};

export default ReviewCard;
