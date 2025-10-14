/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Youtube, Image as ImageIcon, ShoppingCart, ArrowRight } from 'lucide-react';
import { getLinkDetails } from '../utils/linkParser'; // We'll reuse our utility

const PublicProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // This is a NEW public endpoint we need to create on the backend
        const { data } = await axios.get(`http://localhost:5001/api/users/public/${username}`);
        setUser(data.user);
        setLinks(data.links);
      } catch (err) {
        setError('Profile not found.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [username]);

  // This is temporary until we build the collections feature
  const collections = {
    'Featured Content': links.filter(link => link.type === 'video' || link.type === 'product').slice(0, 3),
    'My Portfolio': links.filter(link => link.type === 'image'),
    'Socials & More': links.filter(link => link.type === 'standard'),
  };

  const themes = {
    default: 'from-gray-50 to-gray-200',
    sunset: 'from-orange-100 to-pink-100',
    forest: 'from-green-100 to-teal-100',
    midnight: 'from-gray-800 to-gray-900 text-white',
  };
  const themeClass = themes[user?.theme] || themes.default;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeClass} font-sans transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* --- Profile Header --- */}
        <header className="text-center mb-12">
          <img
            src={user.profilePhotoUrl || `https://avatar.vercel.sh/${user.username}.svg`}
            alt={user.username}
            className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold text-gray-900">@{user.username}</h1>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">{user.bio}</p>
        </header>

        {/* --- Main Content Sections --- */}
        <main className="space-y-12">
          {Object.entries(collections).map(([collectionName, collectionLinks]) => {
            if (collectionLinks.length === 0) return null;

            // Use Carousel for "Featured Content"
            if (collectionName === 'Featured Content') {
              return (
                <section key={collectionName}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 px-2">{collectionName}</h2>
                  <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
                    {collectionLinks.map(link => <FeaturedCard key={link._id} link={link} />)}
                  </div>
                </section>
              );
            }

            // Use Grid for "Image" collections
            if (collectionName === 'My Portfolio') {
               return (
                <section key={collectionName}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 px-2">{collectionName}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {collectionLinks.map(link => <ImageCard key={link._id} link={link} />)}
                  </div>
                </section>
              );
            }
            
            // Use List for everything else
            return (
              <section key={collectionName}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 px-2">{collectionName}</h2>
                <div className="space-y-3">
                  {collectionLinks.map(link => <StandardLink key={link._id} link={link} />)}
                </div>
              </section>
            );
          })}
        </main>
        
        {/* --- Footer --- */}
        <footer className="text-center mt-16">
          <Link to="/" className="text-gray-500 font-semibold hover:text-blue-600 transition-colors">
            Powered by LinkHub
          </Link>
        </footer>
      </div>
    </div>
  );
};

// --- Child Components for different link types ---

const StandardLink = ({ link }) => (
  <a href={link.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
    <div className="font-semibold text-gray-800 text-center">{link.title}</div>
  </a>
);

const ImageCard = ({ link }) => (
  <a href={link.url} target="_blank" rel="noopener noreferrer" className="relative aspect-square bg-white/50 backdrop-blur-md rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300">
    <img src={link.url} alt={link.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
      <p className="text-white font-semibold text-sm">{link.title}</p>
    </div>
  </a>
);

const FeaturedCard = ({ link }) => {
  const details = getLinkDetails(link.url);
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-64 bg-white/50 backdrop-blur-md border border-white/20 rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-video bg-gray-200">
        {details.type === 'video' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Youtube className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        ) : <ShoppingCart className="w-12 h-12 text-blue-500 opacity-70 absolute inset-0 m-auto" />}
         <p className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full font-semibold">{link.type.charAt(0).toUpperCase() + link.type.slice(1)}</p>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{link.title}</h3>
        <p className="text-sm text-blue-600 flex items-center mt-1">
          View {link.type} <ArrowRight className="w-4 h-4 ml-1" />
        </p>
      </div>
    </a>
  );
};

export default PublicProfilePage;