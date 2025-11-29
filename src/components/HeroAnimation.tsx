import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Users, FileText, MessageSquare, Zap } from 'lucide-react';

export function HeroAnimation() {
  const [activeConnection, setActiveConnection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnection((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const orbitItems = [
    { 
      icon: Users, 
      label: 'Team Members', 
      color: 'from-primary to-primary/60',
      position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      angle: 0
    },
    { 
      icon: FileText, 
      label: 'Documents', 
      color: 'from-accent to-accent/60',
      position: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
      angle: 90
    },
    { 
      icon: MessageSquare, 
      label: 'AI Chat', 
      color: 'from-success to-success/60',
      position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
      angle: 180
    },
    { 
      icon: Zap, 
      label: 'Insights', 
      color: 'from-warning to-warning/60',
      position: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
      angle: 270
    },
  ];

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-3xl"></div>
      
      {/* Main container */}
      <div className="relative w-[500px] h-[500px]">
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {orbitItems.map((item, index) => {
            const angle = (index * 90 - 90) * (Math.PI / 180);
            const radius = 200;
            const x1 = 250;
            const y1 = 250;
            const x2 = 250 + Math.cos(angle) * radius;
            const y2 = 250 + Math.sin(angle) * radius;
            
            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: activeConnection === index ? 0.6 : 0.2,
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            );
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbit ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
          style={{ 
            width: '400px', 
            height: '400px',
            left: '50px',
            top: '50px'
          }}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Center brain */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 200
          }}
        >
          <motion.div 
            className="relative"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-2xl opacity-40"></div>
            
            {/* Brain container */}
            <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
              <Brain className="w-16 h-16 text-white" />
            </div>

            {/* Pulsing rings */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-primary"
              animate={{ 
                scale: [1, 1.3, 1.3],
                opacity: [0.8, 0, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-accent"
              animate={{ 
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0]
              }}
              transition={{ 
                duration: 2,
                delay: 0.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Orbiting items */}
        {orbitItems.map((item, index) => {
          const Icon = item.icon;
          const angle = (index * 90 - 90) * (Math.PI / 180);
          const radius = 200;
          const x = 250 + Math.cos(angle) * radius;
          const y = 250 + Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={index}
              className="absolute z-10"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                scale: { delay: 0.2 + index * 0.1, duration: 0.5 },
                opacity: { delay: 0.2 + index * 0.1, duration: 0.5 },
                y: { 
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.div
                className="relative -translate-x-1/2 -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
                animate={{
                  scale: activeConnection === index ? 1.1 : 1,
                }}
              >
                {/* Glow on active */}
                {activeConnection === index && (
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-60`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                  />
                )}
                
                {/* Icon container */}
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl border-4 border-white`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Particle effects */}
                {activeConnection === index && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ 
                        scale: 1.5,
                        opacity: 0
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                      }}
                    >
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${item.color}`}></div>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Data particles flowing */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos((i * 45) * Math.PI / 180) * 200],
              y: [0, Math.sin((i * 45) * Math.PI / 180) * 200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Bottom text */}
      <motion.div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-slate-600 text-lg">
          Connecting your team's knowledge in real-time
        </p>
      </motion.div>
    </div>
  );
}
