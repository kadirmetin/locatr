'use client';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, PartyPopper } from 'lucide-react';

import { scrollToSection } from '@/lib/utils/scrollToSection';

import { AuroraBackground } from '../ui/aurora-background';
import { FlipWords } from '../ui/flip-words';
import HeroBadge from '../ui/hero-badge';

const Hero = () => {
  const words = ['securely', 'privately', 'reliably'];
  const router = useRouter();

  return (
    <section id="hero">
      <AuroraBackground>
        <div className="flex min-h-screen flex-col">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="flex flex-1 flex-col items-center justify-center gap-4 px-4"
          >
            <HeroBadge
              icon={<PartyPopper className="h-4 w-4" />}
              text="We are currently in open beta!"
              endIcon={<ChevronRight className="h-4 w-4" />}
              onClick={() => router.push('/dashboard')}
            />
            <div className="text-center text-2xl font-bold md:text-6xl dark:text-white">
              Stay connected with your family,
              <FlipWords words={words} />
            </div>
            <div className="py-4 font-extralight md:text-4xl dark:text-neutral-200">
              Track your family&#39;s location with <span className="font-bold">Locatr</span>
            </div>
          </motion.div>

          <motion.div
            onClick={() => scrollToSection('features')}
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            <motion.div
              animate={{
                y: [0, 6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            >
              <ChevronDown className="h-8 w-8 cursor-pointer text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </AuroraBackground>
    </section>
  );
};

export default Hero;
