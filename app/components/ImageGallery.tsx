"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Main gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cyber-border cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-xs sm:text-sm text-white">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for enlarged view - make it more mobile-friendly */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              width={1200}
              height={800}
              className="object-contain w-full h-auto"
              sizes="100vw"
            />
            {images[selectedImage].caption && (
              <p className="text-center mt-2 sm:mt-4 text-sm sm:text-base text-white">
                {images[selectedImage].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 