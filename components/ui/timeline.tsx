"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const progressHeight = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height]
  );

  const progressOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    [0, 1]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
      
      const calculateHeight = () => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setHeight(rect.height);
        }
      };

      calculateHeight();
      
      const observer = new ResizeObserver(calculateHeight);
      if (ref.current) {
        observer.observe(ref.current);
      }

      window.addEventListener('resize', calculateHeight);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', calculateHeight);
      };
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl font-sans overflow-hidden" ref={containerRef}>
      <div ref={ref} className="relative mx-auto pb-20">
        <motion.div 
          className="absolute md:left-8 left-8 top-0 w-[2px] h-full"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgb(229 231 235) 50%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)"
          }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 via-blue-500 to-transparent"
            style={{
              height: progressHeight,
              opacity: progressOpacity
            }}
          />
        </motion.div>

        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex justify-start pt-10 md:pt-40 md:gap-20"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white dark:text-white">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white dark:text-white">
                {item.title}
              </h3>
              {item.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};