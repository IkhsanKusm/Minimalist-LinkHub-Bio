/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getLinkDetails } from '../utils/linkParser';
import VideoLinkCard from '../components/VideoLinkCard';
import ProductCard from '../components/ProductCard';

const themes = {
  default: {
    bg: 'bg-gradient-to-br from-gray-50 to-blue-100',
    text: 'text-gray-800',
    name: 'text-gray-900',
    accent: 'text-blue-600',
    button: 'bg-white/80 backdrop-blur-md hover:bg-white text-gray-800 shadow-md',
  },
  sunset: {
    bg: 'bg-gradient-to-br from-orange-100 via-red-100 to-pink-200',
    text: 'text-orange-900',
    name: 'text-red-900',
    accent: 'text-red-600',
    button: 'bg-white/80 backdrop-blur-md hover:bg-white text-orange-900 shadow-md',
  },
  forest: {
    bg: 'bg-gradient-to-br from-green-100 to-teal-200',
    text: 'text-green-900',
    name: 'text-teal-900',
    accent: 'text-green-600',
    button: 'bg-white/80 backdrop-blur-md hover:bg-white text-green-900 shadow-md',
  },
  midnight: {
    bg: 'bg-gradient-to-br from-gray-800 to-black',
    text: 'text-gray-300',
    name: 'text-white',
    accent: 'text-blue-400',
    button: 'bg-gray-700/50 backdrop-blur-md hover:bg-gray-600/50 text-white shadow-lg border border-gray-600',
  },
};

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeTheme = themes[profile?.theme] || themes.default;

  const handleLinkClick = async (link) => {
    try {
      // Send the tracking request but don't wait for it to finish.
      axios.post(`http://localhost:5001/api/links/track/${link._id}`);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:5001/api/users/public-profile/${username}`);
        setProfile(data.profile);
        setLinks(data.links);
        setProducts(data.products || []);
      } catch (err) {
        setError('Profile not found.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleItemClick = async (item, type) => {
    try {
      // Use 'links' or 'products' to build the correct URL
      axios.post(`http://localhost:5001/api/${type}/track/${item._id}`);
    } catch (error) {
      console.error(`Failed to track ${type} click:`, error);
    }
  };

  const videoLinks = links.filter(link => getLinkDetails(link.url).type === 'video');
  const imageLinks = links.filter(link => getLinkDetails(link.url).type === 'image');
  const productLinks = links.filter(link => link.type === 'product');
  const standardLinks = links.filter(link => !['video', 'image', 'product'].includes(getLinkDetails(link.url).type) && link.type !== 'product');
  const storyLinks = imageLinks.slice(0, 8);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">{error}</div>;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${activeTheme.bg} ${activeTheme.text}`}>
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Banner Image Placeholder */}
        <div className="h-40 md:h-56 bg-gradient-to-r from-blue-200 to-purple-300 rounded-2xl shadow-inner mb-[-4rem] md:mb-[-5rem]"></div>

        {/* Profile Header */}
        <header className="relative text-center mb-10">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto border-4 border-white shadow-lg flex items-center justify-center">
             <span className="text-4xl md:text-5xl text-white font-bold">{profile.username?.[0]?.toUpperCase()}</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold mt-3 ${activeTheme.name}`}>@{profile.username}</h1>
          <p className="text-base mt-2 max-w-md mx-auto opacity-80">{profile.bio}</p>
        </header>

        <main className="space-y-10">
          {/* Stories Section */}
          {storyLinks.length > 0 && (
            <section>
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {storyLinks.map(link => (
                  <a onClick={() => handleLinkClick(link)} key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-center group">
                    <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 transform group-hover:scale-105 transition-transform">
                      <div className="bg-white p-1 rounded-full">
                        <img src={link.url} alt={link.title} className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <p className="text-sm font-bold mt-2 w-20 truncate opacity-80">{link.title}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Featured Videos Section */}
          {videoLinks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-1">Featured Videos</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {videoLinks.map(link => (
                  <VideoLinkCard
                    key={link._id}
                    link={link}
                    handleLinkClick={handleLinkClick}
                    themeCardClass={activeTheme.card}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* Image Gallery Section */}
          {imageLinks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-1">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageLinks.map(link => (
                  <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(link)} className="group block aspect-square bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <img src={link.url} alt={link.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </section>
          )}
          
          {/* Shop Section */}
          {products.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-1">Mini Shop Collection</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleItemClick(product, 'products')}
                    theme={activeTheme}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* Standard Links Section */}
          {standardLinks.length > 0 && (
            <section>
              <div className="space-y-4">
                {standardLinks.map(link => (
                  <a onClick={() => handleLinkClick(link)} key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className={`block rounded-full shadow-lg p-4 text-center font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${activeTheme.button}`}>
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 opacity-70 text-sm">
          <Link to="/" className={`font-bold ${activeTheme.accent}`}>
            Powered by LinkHub
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default PublicProfilePage;