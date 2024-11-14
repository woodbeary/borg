"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export function DefinitionForm() {
  const [formData, setFormData] = useState({
    term: "",
    definition: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = await recaptchaRef.current?.executeAsync();
    if (!token) {
      alert('Please complete the CAPTCHA');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/definitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setFormData({ term: "", definition: "" });
      alert('Definition submitted successfully! Awaiting approval.');
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error('Error submitting definition:', error);
      alert('Failed to submit definition. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="term"
          className="block text-[var(--neon-pink)] text-lg font-bold mb-2 cyber-text"
        >
          Term
        </label>
        <input
          type="text"
          id="term"
          className="w-full p-4 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md focus:outline-none focus:border-[var(--neon-purple)] text-lg"
          value={formData.term}
          onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="definition"
          className="block text-[var(--neon-pink)] text-lg font-bold mb-2 cyber-text"
        >
          Definition
        </label>
        <textarea
          id="definition"
          className="w-full p-4 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md focus:outline-none focus:border-[var(--neon-purple)] min-h-[120px] text-lg"
          value={formData.definition}
          onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        size="invisible"
      />

      <button
        type="submit"
        className="w-full cyber-border p-4 text-center hover:scale-105 transition-transform bg-[var(--neon-purple)] text-white font-bold text-xl disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Add Definition"}
      </button>
    </form>
  );
} 