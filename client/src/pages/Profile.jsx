import React, { useState, useEffect } from "react";
import { api } from "@/api/client";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Camera, Save, Loader2, ExternalLink, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PLATFORM_ICONS = {
  spotify: "🎵",
  soundcloud: "☁️",
  instagram: "📸",
  twitter: "🐦",
  youtube: "📺",
  tiktok: "🎬",
  website: "🌐"
};

export default function Profile() {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    spotify_url: "",
    soundcloud_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
    tiktok_url: "",
    website_url: ""
  });

  // Get current user or specific user profile
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await api.getCurrentUser();
        return response.data;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', username || currentUser?.username],
    queryFn: async () => {
      const targetUsername = username || currentUser?.username;
      if (!targetUsername) return null;
      const response = await api.getUser(targetUsername);
      return response.data;
    },
    enabled: !!(username || currentUser?.username),
  });

  const { data: userTracks = [] } = useQuery({
    queryKey: ['userTracks', user?.username],
    queryFn: async () => {
      if (!user?.username) return [];
      const response = await api.getUserTracks(user.username);
      return response.data;
    },
    enabled: !!user?.username,
  });

  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  useEffect(() => {
    if (user && isOwnProfile) {
      setFormData({
        display_name: user.display_name || "",
        bio: user.bio || "",
        spotify_url: user.spotify_url || "",
        soundcloud_url: user.soundcloud_url || "",
        instagram_url: user.instagram_url || "",
        twitter_url: user.twitter_url || "",
        youtube_url: user.youtube_url || "",
        tiktok_url: user.tiktok_url || "",
        website_url: user.website_url || ""
      });
      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      }
    }
  }, [user, isOwnProfile]);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // TODO: Implement avatar upload
      let avatarUrl = user?.avatar_url;
      
      await api.updateProfile({
        ...formData,
        avatar_url: avatarUrl
      });

      queryClient.invalidateQueries(['currentUser']);
      queryClient.invalidateQueries(['user']);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 text-center">
        <User className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
        <p className="text-zinc-400">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (!isOwnProfile || !isEditing) {
    // View mode
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.display_name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center">
                <User className="w-16 h-16 text-zinc-600" />
              </div>
            )}
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.display_name || user.username}</h1>
              <p className="text-zinc-400 mb-4">@{user.username}</p>
              {user.bio && (
                <p className="text-zinc-300 mb-6">{user.bio}</p>
              )}
              
              {/* Stats */}
              <div className="flex gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.tracks_count || userTracks.length}</div>
                  <div className="text-sm text-zinc-500">Tracks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.followers_count || 0}</div>
                  <div className="text-sm text-zinc-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.following_count || 0}</div>
                  <div className="text-sm text-zinc-500">Following</div>
                </div>
              </div>
              
              {/* Actions */}
              {isOwnProfile ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Button variant="outline">
                  Follow
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tracks */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Tracks</h2>
          {userTracks.length > 0 ? (
            <div className="bg-zinc-900/50 rounded-2xl p-2">
              {userTracks.map((track, index) => (
                <div key={track.id} className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-xl transition">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Music className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{track.title}</p>
                    <p className="text-sm text-zinc-400">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-900/50 rounded-2xl">
              <Music className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No tracks yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit mode (own profile)
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
          <User className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-zinc-400">Personaliza tu perfil de artista</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar */}
        <div className="flex justify-center">
          <label className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 group-hover:border-green-500 transition-colors">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                  <User className="w-12 h-12 text-zinc-500" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-400 transition-colors">
              <Camera className="w-5 h-5 text-black" />
            </div>
          </label>
        </div>

        {/* Basic Info */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 space-y-5">
          <div>
            <Label className="text-zinc-300 mb-2 block">Nombre</Label>
            <Input
              value={user?.username || ""}
              disabled
              className="bg-zinc-800 border-zinc-700 text-zinc-400"
            />
            <p className="text-xs text-zinc-500 mt-1">El nombre de usuario no se puede cambiar</p>
          </div>

          <div>
            <Label className="text-zinc-300 mb-2 block">Display Name</Label>
            <Input
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Tu nombre o nombre artístico"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label className="text-zinc-300 mb-2 block">Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Cuéntanos sobre ti y tu música..."
              className="bg-zinc-800 border-zinc-700 min-h-[100px]"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold rounded-xl disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </span>
            ) : saveSuccess ? (
              <span className="flex items-center gap-2">
                ✓ Guardado
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Guardar Perfil
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
