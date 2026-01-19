import React from "react";
import { motion } from "framer-motion";
import { Radio, Disc3 } from "lucide-react";

export default function NowPlaying({ track, isPlaying }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800/50 p-8 sm:p-12">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Vinyl Record Animation */}
        <div className="relative">
          <motion.div 
            className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          >
            {/* Vinyl Base */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-black shadow-2xl">
              {/* Grooves */}
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full border border-zinc-700/30"
                  style={{
                    inset: `${12 + i * 8}%`,
                  }}
                />
              ))}
            </div>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-inner">
                {track?.album_art ? (
                  <img 
                    src={track.album_art} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-black/30">31</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
          </motion.div>

          {/* Arm (optional visual) */}
          <div className="hidden lg:block absolute -right-4 top-1/4 w-32 h-2 bg-zinc-700 rounded-full transform rotate-45 origin-right" />
        </div>

        {/* Track Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
            <span className="text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Radio className="w-3 h-3" />
              {isPlaying ? 'Now Playing' : 'Paused'}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            {track?.title || 'No Track Selected'}
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 mb-6">
            {track?.artist || 'Select a track to play'}
          </p>

          {track?.genre && (
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
                {track.genre}
              </span>
              {track?.mood && (
                <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-400 text-sm">
                  {track.mood}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated Sound Bars */}
      {isPlaying && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-green-500 to-emerald-500 rounded-full"
              animate={{ height: [4, Math.random() * 24 + 8, 4] }}
              transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
