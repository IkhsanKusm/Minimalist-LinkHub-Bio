// src/pages/PublicProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getLinkDetails } from '../utils/linkParser'; // Your excellent link parser utility

const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`http://localhost:5001/api/users/public-profile/${username}`);
        setProfile(data.profile);
        setLinks(data.links);
      } catch (err) {
        setError('Profile not found.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // Group links by type for structured rendering
  const videoLinks = links.filter(link => getLinkDetails(link.url).type === 'video');
  const imageLinks = links.filter(link => getLinkDetails(link.url).type === 'image');
  const productLinks = links.filter(link => link.type === 'product');
  const standardLinks = links.filter(link => !['video', 'image', 'product'].includes(getLinkDetails(link.url).type) && link.type !== 'product');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <header className="text-center mb-12">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center">
             <span className="text-5xl text-white font-bold">{profile.username?.[0]?.toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">@{profile.username}</h1>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">{profile.bio}</p>
        </header>

        <main className="space-y-12">
          {/* Featured Videos Section */}
          {videoLinks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-2">Featured Videos</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {videoLinks.map(link => {
                  const details = getLinkDetails(link.url);
                  return (
                    <div key={link._id} className="flex-shrink-0 w-72">
                      <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform">
                        <div className="aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${details.videoId}`}
                            title={link.title}
                            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                          ></iframe>
                        </div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-semibold truncate hover:text-blue-600">{link.title}</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Image Gallery Section */}
          {imageLinks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-2">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageLinks.map(link => (
                  <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="group block aspect-square bg-white rounded-2xl shadow-md overflow-hidden">
                    <img src={link.url} alt={link.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Shop Section */}
          {productLinks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-2">Shop</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {productLinks.map(link => (
                  <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="group block bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform">
                     {/* We'll add a proper image here later when the Product feature is built */}
                    <div className="aspect-square bg-gray-200 flex items-center justify-center text-4xl">🛍️</div>
                    <div className="p-3">
                      <p className="font-semibold truncate">{link.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Standard Links Section */}
          {standardLinks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 px-2">Links</h2>
              <div className="space-y-4">
                {standardLinks.map(link => (
                  <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl shadow-md p-5 text-center font-semibold transition-transform transform hover:scale-105 hover:shadow-lg">
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
        
        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          Powered by <span className="font-bold text-blue-600">LinkHub</span>
        </footer>
      </div>
    </div>
  );
};

export default PublicProfilePage;