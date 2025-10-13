/* eslint-disable no-unused-vars */
/**
 * Analyzes a URL to determine its type and extract relevant information for embedding.
 * @param {string} url The URL to parse.
 * @returns {{type: 'image'|'video'|'standard', platform?: 'youtube'|'vimeo', videoId?: string, src?: string}}
 */
export const getLinkDetails = (url) => {
  try {
    if (!url.startsWith('http')) {
      url = `https://` + url;
    }
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.toLowerCase();
    const pathname = urlObject.pathname;

    // Image Check (based on file extension)
    if (/\.(jpeg|jpg|gif|png|webp|svg|avif|tiff|bmp)$/i.test(pathname)) {
      return { type: 'image', src: url };
    }

    // YouTube Check
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = null;
      if (hostname.includes('youtu.be')) {
        videoId = pathname.split('/')[1];
      } else if (pathname.includes('/embed/')) {
        videoId = pathname.split('/embed/')[1];
      } else if (pathname.includes('/shorts/')) {
        videoId = pathname.split('/shorts/')[1];
      } else {
        videoId = urlObject.searchParams.get('v');
      }

      if (videoId) {
        // Remove any extra params from videoId
        videoId = videoId.split(/[?&]/)[0];
        return { type: 'video', platform: 'youtube', videoId };
      }
    }

    // Vimeo Check
    if (hostname.includes('vimeo.com')) {
      // Handles vimeo.com/123456789 and player.vimeo.com/video/123456789
      const match = pathname.match(/(?:\/video\/|\/)?(\d+)/);
      if (match && match[1]) {
        const videoId = match[1];
        return { type: 'video', platform: 'vimeo', videoId };
      }
    }

    // Default to standard link
    return { type: 'standard' };
  } catch (error) {
    // If URL is invalid, return standard type
    return { type: 'standard' };
  }
};

export const isValidUrl = (string) => {
  if (!string.startsWith('http')) {
    string = `https://` + string;
  }
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};