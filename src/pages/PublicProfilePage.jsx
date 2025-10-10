import React from 'react';
import { useParams } from 'react-router-dom';

const PublicProfilePage = () => {
  const { username } = useParams();
  
  // In real app, fetch user data based on username
  const user = {
    username: username,
    bio: 'Digital creator sharing amazing content ✨',
    theme: 'default'
  };

  const links = [
    { title: 'Instagram', url: 'https://instagram.com', type: 'standard' },
    { title: 'My YouTube', url: 'https://youtube.com', type: 'video' },
    { title: 'My Shop', url: 'https://shop.com', type: 'product' }
  ];

  const themes = {
    default: 'bg-gradient-to-br from-blue-500 to-purple-600',
    sunset: 'bg-gradient-to-br from-orange-500 to-pink-600',
    forest: 'bg-gradient-to-br from-green-500 to-teal-600',
    midnight: 'bg-gradient-to-br from-gray-800 to-gray-900'
  };

  return (
    <div className={`min-h-screen ${themes[user.theme] || themes.default} text-white`}>
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 border-2 border-white/30"></div>
          <h1 className="text-2xl font-bold mb-2">@{user.username}</h1>
          <p className="text-white/80 leading-relaxed">{user.bio}</p>
        </div>

        <div className="space-y-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/20 backdrop-blur-sm rounded-xl py-4 px-6 text-center transition-all hover:bg-white/30 hover:scale-105 border border-white/30"
            >
              <div className="font-semibold">{link.title}</div>
              {link.type === 'product' && (
                <div className="text-xs opacity-80 mt-1">🛒 Product</div>
              )}
            </a>
          ))}
        </div>

        <div className="text-center mt-8 text-white/60 text-sm">
          Powered by LinkHub
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;