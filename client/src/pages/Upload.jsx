import React, { useState } from "react";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload as UploadIcon, Music, Image as ImageIcon, Check, Loader2, AlertCircle, Youtube, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GENRES = ['Electronic', 'Ambient', 'Lo-Fi', 'Classical', 'Jazz', 'Pop', 'Rock', 'Hip Hop', 'Other'];
const MOODS = ['Chill', 'Energetic', 'Melancholic', 'Focus', 'Party', 'Romance', 'Sleep'];

export default function Upload() {
  const queryClient = useQueryClient();
  const [audioFile, setAudioFile] = useState(null);
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    youtube_url: "",
    genre: "Other",
    mood: "Chill",
    license_type: "original",
    license_confirmed: false
  });

  const handleAudioSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      
      if (!formData.title) {
        const name = file.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({ ...prev, title: name }));
      }
    }
  };

  const handleArtworkSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtworkFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setArtworkPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.license_confirmed) {
      alert("Please confirm you have rights to upload this content");
      return;
    }

    setIsUploading(true);
    
    try {
      const trackData = {
        ...formData,
        file_url: formData.youtube_url || "https://example.com/placeholder.mp3",
        duration: 180
      };

      await api.post("/api/tracks", trackData);
      
      queryClient.invalidateQueries(["tracks"]);
      setUploadSuccess(true);
      
      setTimeout(() => {
        setAudioFile(null);
        setArtworkFile(null);
        setArtworkPreview(null);
        setUploadSuccess(false);
        setFormData({
          title: "",
          artist: "",
          description: "",
          youtube_url: "",
          genre: "Other",
          mood: "Chill",
          license_type: "original",
          license_confirmed: false
        });
      }, 3000);
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Upload Track</h1>
          <p className="text-zinc-400">Share your music with the world</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio File Upload */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Audio File
              </CardTitle>
              <CardDescription>Upload your audio file or provide a YouTube URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audio-file" className="block mb-2">Audio File (Optional)</Label>
                <div className="relative">
                  <input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="audio-file"
                    className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 cursor-pointer transition group"
                  >
                    {audioFile ? (
                      <>
                        <Music className="w-6 h-6 text-green-500" />
                        <span className="text-sm font-medium">{audioFile.name}</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-6 h-6 text-zinc-500 group-hover:text-zinc-400" />
                        <span className="text-sm text-zinc-500 group-hover:text-zinc-400">Click to upload audio file</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 text-zinc-500 text-sm">
                <div className="flex-1 h-px bg-zinc-800" />
                <span>OR</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              <div>
                <Label htmlFor="youtube-url" className="flex items-center gap-2 mb-2">
                  <Youtube className="w-4 h-4" />
                  YouTube URL
                </Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Track Information */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Track Information</CardTitle>
              <CardDescription>Provide details about your track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  placeholder="Track title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  placeholder="Artist name"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your track..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOODS.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Artwork */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Artwork
              </CardTitle>
              <CardDescription>Upload album artwork (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <input
                  id="artwork-file"
                  type="file"
                  accept="image/*"
                  onChange={handleArtworkSelect}
                  className="hidden"
                />
                <label
                  htmlFor="artwork-file"
                  className="flex items-center justify-center w-full h-48 border-2 border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 cursor-pointer transition group overflow-hidden"
                >
                  {artworkPreview ? (
                    <img src={artworkPreview} alt="Artwork preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-zinc-500 group-hover:text-zinc-400" />
                      <span className="text-sm text-zinc-500 group-hover:text-zinc-400">Click to upload artwork</span>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* License */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                License
              </CardTitle>
              <CardDescription>Confirm your rights to upload this content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="license-type">License Type</Label>
                <Select value={formData.license_type} onValueChange={(value) => setFormData({ ...formData, license_type: value })}>
                  <SelectTrigger id="license-type">
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original Content</SelectItem>
                    <SelectItem value="royalty_free">Royalty Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="license-confirm"
                  checked={formData.license_confirmed}
                  onCheckedChange={(checked) => setFormData({ ...formData, license_confirmed: checked })}
                />
                <Label htmlFor="license-confirm" className="text-sm leading-relaxed cursor-pointer">
                  I confirm that I have the rights to upload and distribute this content
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert className="bg-green-900/20 border-green-500/50">
                <Check className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Track uploaded successfully!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUploading || !formData.title || !formData.license_confirmed}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Track
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
