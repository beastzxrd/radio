import React, { useState, useEffect, useRef } from "react";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import NowPlaying from "@/components/NowPlaying";
import TrackCard from "@/components/TrackCard";

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const response = await api.getTracks({ limit: 50, sort: '-created_at' });
      return response.data;
    },
  });



  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.file_url) return;
    
    const playAudio = async () => {
      audio.src = currentTrack.file_url;
      audio.load();
      
      audio.oncanplaythrough = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Error playing audio:", err);
        }
      };
      
      audio.onerror = (e) => {
        console.error("Audio error:", e);
      };
    };
    
    playAudio();
  }, [currentTrack]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handlePlayTrack = (track, index) => {
    if (currentTrack?.id === track.id) {
      handlePlayPause();
    } else {
      setCurrentIndex(index);
      setCurrentTrack(track);
    }
  };

  const handleNext = () => {
    if (tracks.length > 0) {
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentTrack(tracks[nextIndex]);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (tracks.length > 0) {
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      setCurrentTrack(tracks[prevIndex]);
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  const featuredTracks = tracks.slice(0, 6);
  const recentTracks = tracks.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <audio ref={audioRef} preload="auto" />
      
      {/* Hero Section - Now Playing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <NowPlaying track={currentTrack} isPlaying={isPlaying} />
      </motion.div>

      {/* Featured Section */}
      {featuredTracks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">Featured Tracks</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePlayTrack(track, index)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  {track.album_art ? (
                    <img 
                      src={track.album_art} 
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <span className="text-4xl text-zinc-600">♪</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-xl">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <span className="text-black text-lg">❚❚</span>
                      ) : (
                        <span className="text-black text-lg ml-1">▶</span>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
                <p className="text-xs text-zinc-500 truncate">{track.artist || 'Unknown'}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Tracks */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-bold text-white">Recent Tracks</h2>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentTracks.length > 0 ? (
          <div className="bg-zinc-900/50 rounded-2xl p-2">
            {recentTracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index}
                isPlaying={isPlaying}
                isCurrentTrack={currentTrack?.id === track.id}
                onPlay={() => handlePlayTrack(track, index)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-400">No tracks yet. Upload some music to get started!</p>
          </div>
        )}
      </section>

      {/* Audio Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTrackEnd={handleNext}
        audioRef={audioRef}
      />
    </div>
  );
}
