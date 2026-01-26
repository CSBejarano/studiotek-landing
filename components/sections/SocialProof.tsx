'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '150+', label: 'Proyectos' },
  { value: '98%', label: 'Satisfacción' },
  { value: '40%', label: 'Ahorro medio' },
];

export function SocialProof() {
  return (
    <section className="py-8 bg-slate-900/50 border-y border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <span className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </span>
              <span className="block text-sm text-slate-400 mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
