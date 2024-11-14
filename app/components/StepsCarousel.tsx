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
    image: "/images/step1.jpg", // You'll add these images later
    caption: "The sacred vessel awaits"
  },
  {
    number: 2,
    text: "Pour out 1/4 to 1/2 of the water",
    image: "/images/step2.jpg",
    caption: "Making room for enhancement"
  },
  {
    number: 3,
    text: "Add your chosen enhancement liquid",
    image: "/images/step3.jpg",
    caption: "The ritual begins"
  },
  {
    number: 4,
    text: "Add electrolytes and caffeine (optional)",
    image: "/images/step4.jpg",
    caption: "Power-up your BORG"
  },
  {
    number: 5,
    text: "Shake well and chill",
    image: "/images/step5.jpg",
    caption: "The final blessing"
  }
];

export function StepsCarousel() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="cyber-border p-4 sm:p-6 md:p-8 mb-8 sm:mb-16 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 neon-text text-center">
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
        className="w-full h-[500px] rounded-lg"
      >
        {STEPS.map((step) => (
          <SwiperSlide key={step.number}>
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              <Image
                src={step.image}
                alt={`Step ${step.number}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[var(--neon-purple)] text-4xl font-bold">
                    {step.number}.
                  </span>
                  <h3 className="text-2xl font-bold text-white">
                    {step.text}
                  </h3>
                </div>
                <p className="text-gray-200 text-lg">
                  {step.caption}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 