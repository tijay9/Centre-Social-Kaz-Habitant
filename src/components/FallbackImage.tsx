import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface FallbackImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc?: string;
}

export default function FallbackImage({ src, fallbackSrc = '/logo.png', alt, ...rest }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc7f2b]"></div>
        </div>
      )}
      <Image
        {...rest}
        src={imgSrc}
        alt={alt}
        unoptimized={true}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.error('Erreur de chargement image:', imgSrc);
          setHasError(true);
          setIsLoading(false);
          setImgSrc(fallbackSrc);
        }}
      />
    </>
  );
}
