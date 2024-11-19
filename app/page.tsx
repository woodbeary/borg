"use client";

import { CyberBackground } from "./components/CyberBackground";
import { SAFETY_TIPS } from "./data/borgData";
import { DefinitionForm } from "./components/DefinitionForm";
import { StepsCarousel } from "./components/StepsCarousel";
import { useDefinitions } from "./hooks/useDefinitions";
import { useVoting } from "./hooks/useVoting";
import type { Definition } from "@/app/types/definitions";

export default function Home() {
  const { 
    definitions, 
    loadMoreDefinitions, 
    addDefinitionLocally,
    loading,
    error,
    hasMore,
    updateDefinitionVote 
  } = useDefinitions();

  const handleDefinitionAdded = (newDefinition: Definition) => {
    addDefinitionLocally(newDefinition);
  };

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
          <DynamicDictionary 
            definitions={definitions}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadMoreDefinitions={loadMoreDefinitions}
            updateDefinitionVote={updateDefinitionVote}
          />
        </section>

        {/* Submission Form */}
        <section className="cyber-border p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 neon-text text-center">
            Add Your Definition
          </h2>
          <DefinitionForm onDefinitionAdded={handleDefinitionAdded} />
        </section>
      </div>
    </>
  );
}

interface DynamicDictionaryProps {
  definitions: Definition[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreDefinitions: (reset?: boolean) => Promise<void>;
  updateDefinitionVote: (id: string, increment: number) => void;
}

function DynamicDictionary({ 
  definitions,
  loading,
  error,
  hasMore,
  loadMoreDefinitions,
  updateDefinitionVote
}: DynamicDictionaryProps) {
  const { vote, hasVoted, getVoteType } = useVoting(updateDefinitionVote);

  if (error) {
    return (
      <div className="text-center text-red-400">
        {error}
      </div>
    );
  }

  const handleVote = async (id: string, voteType: 'up' | 'down') => {
    if (!id) return;
    const success = await vote(id, voteType);
    if (success) {
      loadMoreDefinitions();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {definitions.map((def) => {
          const voted = hasVoted(def.id!);
          const voteType = getVoteType(def.id!);
          
          return (
            <div
              key={def.id || def.term}
              className="cyber-border p-6 hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl font-bold text-[var(--neon-pink)] mb-2">
                {def.term}
              </h3>
              <p className="text-gray-300">{def.definition}</p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>Added by {def.author || 'Anonymous'}</span>
                {!def.isStatic && def.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(def.id!, 'up')}
                      disabled={voted}
                      className={`p-1 rounded transition-colors ${
                        voteType === 'up' 
                          ? 'text-green-400' 
                          : 'hover:text-green-400'
                      } ${voted && voteType !== 'up' ? 'opacity-50' : ''}`}
                    >
                      👍
                    </button>
                    <span className={`font-mono ${def.votes >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {def.votes}
                    </span>
                    <button
                      onClick={() => handleVote(def.id!, 'down')}
                      disabled={voted}
                      className={`p-1 rounded transition-colors ${
                        voteType === 'down' 
                          ? 'text-red-400' 
                          : 'hover:text-red-400'
                      } ${voted && voteType !== 'down' ? 'opacity-50' : ''}`}
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
              {!def.isStatic && (
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(def.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {(loading || hasMore) && (
        <div className="text-center mt-8">
          <button
            onClick={() => loadMoreDefinitions()}
            disabled={loading}
            className="cyber-border px-6 py-3 hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
