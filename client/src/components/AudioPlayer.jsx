import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayer({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onTrackEnd,
  audioRef 
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (onTrackEnd) {
        onTrackEnd();
      }
    };
    const handleCanPlay = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    // Check if duration is already available
    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, repeat, onTrackEnd, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, audioRef]);

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-zinc-950 to-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:w-64">
            <motion.div 
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-2xl"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            >
              {currentTrack.album_art ? (
                <img 
                  src={currentTrack.album_art} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">♪</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 rounded-full" style={{ margin: '35%' }} />
            </motion.div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">{currentTrack.title}</p>
              <p className="text-zinc-400 text-xs sm:text-sm truncate">{currentTrack.artist || 'Unknown Artist'}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShuffle(!shuffle)}
                className={`hidden sm:block p-2 rounded-full transition-all ${shuffle ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button 
                onClick={onPrevious}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <motion.button 
                onClick={onPlayPause}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-black hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/25"
              >
                {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />}
              </motion.button>
              <button 
                onClick={onNext}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setRepeat(!repeat)}
                className={`hidden sm:block p-2 rounded-full transition-all ${repeat ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden sm:flex items-center gap-3 w-full">
              <span className="text-xs text-zinc-500 w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1 cursor-pointer"
              />
              <span className="text-xs text-zinc-500 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(v) => { setVolume(v[0]); setIsMuted(false); }}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
