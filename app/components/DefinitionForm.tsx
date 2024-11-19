"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { cn } from "@/lib/utils";
import type { Definition } from "@/app/types/definitions";

interface SubmissionError {
  message: string;
  reason?: string;
  suggestions?: string[];
}

interface DefinitionFormProps {
  onDefinitionAdded?: (newDefinition: Definition) => void;
}

export function DefinitionForm({ onDefinitionAdded }: DefinitionFormProps) {
  const [formData, setFormData] = useState({
    term: "",
    definition: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<SubmissionError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const token = await recaptchaRef.current?.executeAsync();
    if (!token) {
      setError({ message: 'Please complete the CAPTCHA verification.' });
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

      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.message,
          reason: data.reason,
          suggestions: data.suggestions
        });
        return;
      }

      const newDefinition: Definition = {
        id: data.id,
        term: formData.term,
        definition: formData.definition,
        votes: 0,
        createdAt: new Date().toISOString(),
        author: 'Anonymous'
      };

      setSuccess(data.message);
      setFormData({ term: "", definition: "" });
      recaptchaRef.current?.reset();
      
      onDefinitionAdded?.(newDefinition);
      
    } catch (error) {
      setError({ 
        message: 'Failed to submit definition. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200 space-y-2">
          <p className="font-bold">{error.message}</p>
          {error.reason && (
            <p className="text-sm opacity-90">{error.reason}</p>
          )}
          {error.suggestions && error.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Suggestions:</p>
              <ul className="list-disc list-inside text-sm opacity-90">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-900/50 border border-green-500 rounded-md text-green-200">
          {success}
        </div>
      )}

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
          className={cn(
            "w-full p-4 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md focus:outline-none focus:border-[var(--neon-purple)] text-lg",
            isSubmitting && "opacity-50"
          )}
          value={formData.term}
          onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
          required
          disabled={isSubmitting}
          placeholder="Enter a BORG-related term..."
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
          className={cn(
            "w-full p-4 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md focus:outline-none focus:border-[var(--neon-purple)] min-h-[120px] text-lg",
            isSubmitting && "opacity-50"
          )}
          value={formData.definition}
          onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
          required
          disabled={isSubmitting}
          placeholder="Explain your BORG term in detail..."
        />
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        size="invisible"
      />

      <button
        type="submit"
        className={cn(
          "w-full cyber-border p-4 text-center hover:scale-105 transition-transform bg-[var(--neon-purple)] text-white font-bold text-xl",
          isSubmitting && "opacity-50 cursor-not-allowed"
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Add Definition"}
      </button>
    </form>
  );
} 