'use client';

import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { useAuthContext } from '@/context/auth-provider';

const DashboardLoader = ({ children }: { children: React.ReactNode }) => {
  const { isFetching, isLoggingOut } = useAuthContext();
  const [hasFetched, setHasFetched] = useState(false);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!isFetching && !isLoggingOut && !initialFetchDone.current) {
      setHasFetched(true);
      initialFetchDone.current = true;
    }

    if (isLoggingOut) {
      setHasFetched(false);
      initialFetchDone.current = false;
    }
  }, [isFetching, isLoggingOut]);

  if (!hasFetched)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
        </motion.div>
        <span className="text-md text-muted-foreground">Loading...</span>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  );
};

export default DashboardLoader;
