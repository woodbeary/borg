"use client";

import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Step {
  number: number;
  text: string;
  image: string;
  caption: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    text: "Acquire a gallon of water",
    image: "/step1.png",
    caption: "The sacred vessel awaits"
  },
  {
    number: 2,
    text: "Pour out 1/4 to 1/2 of the water",
    image: "/step2.png",
    caption: "Making room for enhancement"
  },
  {
    number: 3,
    text: "Add your chosen enhancement liquid",
    image: "/step3.png",
    caption: "The ritual begins"
  },
  {
    number: 4,
    text: "Add electrolytes and caffeine (optional)",
    image: "/step4.png",
    caption: "Power-up your BORG"
  },
  {
    number: 5,
    text: "Shake well and chill",
    image: "/step5.png",
    caption: "The final blessing"
  }
];

export function StepsCarousel() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="relative p-4 sm:p-6 md:p-8 mb-8 sm:mb-16 max-w-5xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-purple-900/20 blur-xl" />
      
      <div className="relative bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <h2 className="text-3xl sm:text-4xl font-bold py-8 neon-text text-center">
          The Sacred Process
        </h2>
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={!isMobile}
          className="w-full aspect-video"
        >
          {STEPS.map((step) => (
            <SwiperSlide key={step.number} className="flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Image Container */}
                <div className="absolute inset-0 flex items-center justify-center px-16 py-8">
                  <div className="relative w-full h-full max-w-2xl mx-auto">
                    <Image
                      src={step.image}
                      alt={`Step ${step.number}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </div>
                
                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-8 pt-16 pb-8">
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[var(--neon-purple)] text-4xl font-bold" style={{ 
                          textShadow: '0 0 20px var(--neon-purple)' 
                        }}>
                          {step.number}
                        </span>
                        <h3 className="text-2xl font-bold text-white/90 tracking-wide">
                          {step.text}
                        </h3>
                      </div>
                      <p className="text-[var(--neon-blue)] text-lg opacity-80 pl-12 font-light">
                        {step.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
} 