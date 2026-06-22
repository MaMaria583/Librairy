"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&h=800&fit=crop&q=80",
    alt: "Enfants lisant ensemble",
  },
  {
    src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&h=800&fit=crop&q=80",
    alt: "Homme lisant près d'une fenêtre",
  },
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&h=800&fit=crop&q=80",
    alt: "Bibliothèque classique",
  },
  {
    src: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&h=800&fit=crop&q=80",
    alt: "Femme parcourant des livres d'art",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[420px] md:h-[500px] overflow-hidden">
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            priority={idx === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1e3a5f]/65" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 lg:px-10 text-white max-w-2xl">
          <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-white/70 mb-3 font-medium">
            Des milliers d&apos;ouvrages sélectionnés avec passion
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 uppercase tracking-tight">
            DÉCOUVREZ VOTRE PROCHAINE<br />AVENTURE LITTÉRAIRE
          </h1>
          <p className="text-sm md:text-base text-white/70 mb-7 max-w-lg">
            Les meilleurs ouvrages sélectionnés avec passion.<br />Explorez et voyagez.
          </p>
          <Link
            href="/livres"
            className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] font-bold px-7 py-3 rounded-md hover:bg-white/90 transition-colors text-sm uppercase tracking-wider"
          >
            Collections récentes
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
