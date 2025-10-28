import React from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Download } from 'lucide-react';

const ImageGallery = ({ images, handleItemClick }) => {
  
  // This function handles downloading an image from an external URL.
  const handleDownload = async (imageUrl, imageName) => {
    try {
      // Axios to fetch the image data as a 'blob' (a file-like object).
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'blob',
      });

      // Temporary URL from the blob data.
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      // Temporary link element.
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Set the 'download' attribute. This tells the browser to download the file
      link.setAttribute('download', `${imageName}.jpg`);
      
      // Programmatically click the link to trigger the download.
      document.body.appendChild(link);
      link.click();
      
      // Clean up by removing the temporary link and URL.
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Image download failed:', error);
      // If the robust download fails (often due to CORS), fall back to opening in a new tab.
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={16}
      slidesPerView={1.5} // Show 1 full slide and a peek of the next one
      centeredSlides={true}
      loop={images.length > 2} // Loop only if there are enough slides
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        // On larger screens, show more slides
        640: {
          slidesPerView: 2.5,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
      }}
      className="!pb-10" // Add padding-bottom for pagination dots
    >
      {images.map((link) => (
        <SwiperSlide key={link._id} className="group">
          <div className="aspect-square bg-gray-100 rounded-2xl shadow-lg overflow-hidden relative">
            <img 
              src={link.url} 
              alt={link.title} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" 
            />
            {/* Clickable overlay for analytics tracking */}
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => handleItemClick(link, 'links')}
              className="absolute inset-0"
              aria-label={`View image: ${link.title}`}
            ></a>
            
            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the link click from firing
                handleDownload(link.url, link.title);
              }}
              className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white hover:scale-110 shadow-md transition-all"
              aria-label="Download image"
            >
              <Download size={18} />
            </button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageGallery;