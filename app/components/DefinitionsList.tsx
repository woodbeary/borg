"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { BORG_TERMS } from "@/app/data/borgData";

export function DefinitionsList() {
  return (
    <Swiper
      modules={[Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="w-full"
      breakpoints={{
        640: {
          slidesPerView: 2,
        }
      }}
    >
      {BORG_TERMS.map((term, index) => (
        <SwiperSlide key={index}>
          <div className="cyber-border p-6 h-full">
            <h3 className="text-3xl font-bold text-[var(--neon-pink)] mb-4 cyber-text">
              {term.term}
            </h3>
            <p className="cyber-text mb-4">{term.definition}</p>
            <p className="text-sm text-white/70 cyber-text">
              Added by {term.author}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 