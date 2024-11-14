"use client";

import { CyberBackground } from "./components/CyberBackground";
import { SAFETY_TIPS, BORG_TERMS } from "./data/borgData";
import { DefinitionForm } from "./components/DefinitionForm";
import { StepsCarousel } from "./components/StepsCarousel";

export default function Home() {
  return (
    <>
      <CyberBackground />
      <div className="relative min-h-screen p-4 sm:p-6 md:p-8">
        {/* Hero Section */}
        <header className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold neon-text mb-2 sm:mb-4">
            How to BORG
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[var(--neon-pink)]">
            Your guide to the Black Out Rage Gallon
          </p>
        </header>

        {/* Steps Section */}
        <StepsCarousel />

        {/* Safety Tips Section */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 neon-text text-center">
            Safety Protocol
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {SAFETY_TIPS.map((tip, index) => (
              <div key={index} className="cyber-border p-4">
                <div className="text-4xl mb-2 text-center">{tip.icon}</div>
                <h3 className="text-lg font-bold text-[var(--neon-pink)] mb-2 text-center">
                  {tip.title}
                </h3>
                <p className="text-sm text-center text-gray-300">{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dictionary Section */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 neon-text text-center">
            BORG Dictionary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {BORG_TERMS.map((term, index) => (
              <div
                key={index}
                className="cyber-border p-6 hover:scale-105 transition-transform"
              >
                <h3 className="text-2xl font-bold text-[var(--neon-pink)] mb-2">
                  {term.term}
                </h3>
                <p className="text-gray-300">{term.definition}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Added by {term.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Submission Form */}
        <section className="cyber-border p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 neon-text text-center">
            Add Your Definition
          </h2>
          <DefinitionForm />
        </section>
      </div>
    </>
  );
}
