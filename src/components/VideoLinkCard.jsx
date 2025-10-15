import React, { useState } from 'react';
import { getLinkDetails } from '../utils/linkParser';
import { PlayCircle } from 'lucide-react';

const VideoLinkCard = ({ link, handleLinkClick, themeCardClass }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const details = getLinkDetails(link.url);

  if (!details.videoId) {
    // If for some reason the URL is not a valid video, don't render anything
    return null;
  }

  const handlePlayClick = () => {
    // First, track the click using the function passed from the parent
    handleLinkClick(link);
    // Then, set the state to show the video player
    setIsPlaying(true);
  };

  if (isPlaying) {
    // If the video is playing, render the iframe
    return (
      <div className={`flex-shrink-0 w-72 rounded-2xl shadow-lg overflow-hidden ${themeCardClass}`}>
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${details.videoId}?autoplay=1&rel=0`}
            title={link.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="p-3 text-sm font-semibold truncate">{link.title}</p>
      </div>
    );
  }

  // By default, render the thumbnail with the click handler
  return (
    <div
      onClick={handlePlayClick}
      className={`flex-shrink-0 w-72 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group ${themeCardClass}`}
    >
      <div className="aspect-video relative">
        {/* YouTube Thumbnail */}
        <img
          src={`https://img.youtube.com/vi/${details.videoId}/hqdefault.jpg`}
          alt={link.title}
          className="w-full h-full object-cover"
        />
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <PlayCircle size={64} className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
        </div>
      </div>
      <p className="p-3 text-sm font-semibold truncate">{link.title}</p>
    </div>
  );
};

export default VideoLinkCard;