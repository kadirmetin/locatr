import Link from 'next/link';

import { MoveLeft } from 'lucide-react';

export default function TopHomeButton() {
  return (
    <Link
      href="/"
      className="fixed left-4 top-4 z-50 inline-flex items-center rounded-lg px-3 py-2 text-sm text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <MoveLeft className="mr-2 h-4 w-4" />
      LOCATR
    </Link>
  );
}
