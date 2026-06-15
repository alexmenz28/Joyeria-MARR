import { UserCircleIcon } from '@heroicons/react/24/solid';

type UserAvatarProps = {
  className?: string;
};

/** Consistent account avatar (no external placeholder images). */
export default function UserAvatar({ className = 'h-8 w-8' }: UserAvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-100 to-gold-200/80 ring-2 ring-gold-500/35 dark:from-night-700 dark:to-night-800 dark:ring-gold-500/50 ${className}`}
      aria-hidden
    >
      <UserCircleIcon className="h-[85%] w-[85%] text-gold-700 dark:text-marrGold" />
    </span>
  );
}
