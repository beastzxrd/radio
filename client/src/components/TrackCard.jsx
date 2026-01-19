import React from "react";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackCard({ track, isPlaying, isCurrentTrack, onPlay, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
        isCurrentTrack 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30' 
          : 'hover:bg-zinc-800/50 border border-transparent'
      }`}
      onClick={onPlay}
    >
      {/* Index/Play Button */}
      <div className="w-8 flex items-center justify-center">
        <span className={`text-sm font-medium group-hover:hidden ${isCurrentTrack ? 'text-green-500' : 'text-zinc-500'}`}>
          {index + 1}
        </span>
        <button className="hidden group-hover:flex w-8 h-8 items-center justify-center text-white">
          {isCurrentTrack && isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </div>

      {/* Album Art */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        {track.album_art ? (
          <img 
            src={track.album_art} 
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 text-lg">♪</span>
          </div>
        )}
        {isCurrentTrack && isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-green-500 rounded-full"
                  animate={{ height: [8, 16, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
          {track.title}
        </p>
        <p className="text-sm text-zinc-400 truncate">{track.artist || 'Unknown Artist'}</p>
      </div>

      {/* Genre Tag */}
      {track.genre && (
        <span className="hidden sm:block px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400">
          {track.genre}
        </span>
      )}

      {/* Duration */}
      <span className="text-sm text-zinc-500 w-12 text-right">
        {track.duration ? `${Math.floor(track.duration / 60)}:${String(Math.floor(track.duration % 60)).padStart(2, '0')}` : '--:--'}
      </span>
    </motion.div>
  );
}
