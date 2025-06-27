import React from 'react';

export interface SmartProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Smart Product Image Component
 * Automatically serves WebP/AVIF when available, PNG/JPG as fallback
 * No configuration needed - just add images to public/assets/models/
 */
export const SmartProductImage: React.FC<SmartProductImageProps> = ({
  src,
  alt,
  className,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  // Only optimize product model images
  if (!src.startsWith('/assets/models/')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  // Generate optimized image paths
  const { name, dir } = (() => {
    const parts = src.split('/');
    const filename = parts.pop() || '';
    const [name] = filename.split('.');
    const dir = parts.join('/');
    return { name, dir };
  })();

  const avifSrc = `${dir}/${name}.avif`;
  const webpSrc = `${dir}/${name}.webp`;

  return (
    <picture>
      {/* AVIF - Best compression, newest browsers */}
      <source srcSet={avifSrc} type="image/avif" />
      
      {/* WebP - Good compression, wide support */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* PNG/JPG - Fallback for older browsers */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
      />
    </picture>
  );
};

export default SmartProductImage;