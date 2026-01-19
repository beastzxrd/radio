import React, { useState, useRef, useEffect } from "react";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AudioPlayer from "@/components/AudioPlayer";
import TrackCard from "@/components/TrackCard";

const GENRES = ['All', 'Electronic', 'Ambient', 'Lo-Fi', 'Classical', 'Jazz', 'Pop', 'Rock', 'Hip Hop', 'Other'];
const MOODS = ['All', 'Chill', 'Energetic', 'Melancholic', 'Focus', 'Party', 'Romance', 'Sleep'];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [viewMode, setViewMode] = useState("list");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks-library'],
    queryFn: async () => {
      const response = await api.getTracks({ limit: 100, sort: '-created_at' });
      return response.data;
    },
  });

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = !searchQuery || 
      track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || track.genre === selectedGenre;
    const matchesMood = selectedMood === "All" || track.mood === selectedMood;
    return matchesSearch && matchesGenre && matchesMood;
  });

  useEffect(() => {
    if (audioRef.current && currentTrack?.file_url) {
      audioRef.current.src = currentTrack.file_url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrack, isPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlayTrack = (track, index) => {
    if (currentTrack?.id === track.id) {
      handlePlayPause();
    } else {
      setCurrentTrack(track);
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (filteredTracks.length > 0) {
      const nextIndex = (currentIndex + 1) % filteredTracks.length;
      setCurrentTrack(filteredTracks[nextIndex]);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (filteredTracks.length > 0) {
      const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
      setCurrentTrack(filteredTracks[prevIndex]);
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <audio ref={audioRef} preload="auto" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Library</h1>
        <p className="text-zinc-400">Browse all tracks in the collection</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search tracks or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
          />
        </div>
        <div className="flex gap-3">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-36 bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMood} onValueChange={setSelectedMood}>
            <SelectTrigger className="w-36 bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map(mood => (
                <SelectItem key={mood} value={mood}>{mood}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden sm:flex border border-zinc-800 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-zinc-800" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-zinc-800" : ""}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Track Count */}
      <p className="text-sm text-zinc-500 mb-4">
        {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''} found
      </p>

      {/* Tracks */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredTracks.length > 0 ? (
        viewMode === "list" ? (
          <div className="bg-zinc-900/50 rounded-2xl p-2">
            {filteredTracks.map((track, index) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
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
                      <Music className="w-12 h-12 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-xl">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <span className="text-black text-lg">❚❚</span>
                      ) : (
                        <span className="text-black text-lg ml-1">▶</span>
                      )}
                    </div>
                  </div>
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-2 left-2 flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-amber-500 rounded-full"
                          animate={{ height: [6, 12, 6] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
                <p className="text-xs text-zinc-500 truncate">{track.artist || 'Unknown'}</p>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
            <Music className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 mb-2">No tracks found</p>
          <p className="text-sm text-zinc-500">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Audio Player */}
      {currentTrack && (
        <AudioPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onTrackEnd={handleNext}
          audioRef={audioRef}
        />
      )}
    </div>
  );
}
