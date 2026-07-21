import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.config';

export const configureCloudinary = () => {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    console.log('[Cloudinary Config] Cloudinary storage configured.');
  } else {
    console.warn('[Cloudinary Config] Credentials pending. Cloudinary configuration ready.');
  }
  return cloudinary;
};
