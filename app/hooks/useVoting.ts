"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase/client";
import type { VoteRecord } from "@/app/types/definitions";

const VOTE_STORAGE_KEY = 'borg_votes';

export function useVoting(updateDefinitionVote?: (id: string, increment: number) => void) {
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);

  // Load vote records from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY);
    if (stored) {
      setVoteRecords(JSON.parse(stored));
    }
  }, []);

  // Save vote records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(voteRecords));
  }, [voteRecords]);

  const vote = async (definitionId: string, voteType: 'up' | 'down') => {
    try {
      if (hasVoted(definitionId)) {
        return false;
      }

      const docRef = doc(db, "definitions", definitionId);
      const incrementValue = voteType === 'up' ? 1 : -1;
      
      await updateDoc(docRef, {
        votes: incrementValue
      });

      // Update local state immediately
      if (updateDefinitionVote) {
        updateDefinitionVote(definitionId, incrementValue);
      }

      // Record the vote locally
      setVoteRecords(prev => [...prev, {
        definitionId,
        vote: voteType,
        timestamp: Date.now()
      }]);

      return true;
    } catch (error) {
      console.error('Error voting:', error);
      return false;
    }
  };

  const hasVoted = (definitionId: string) => 
    voteRecords.some(record => record.definitionId === definitionId);

  const getVoteType = (definitionId: string) => 
    voteRecords.find(record => record.definitionId === definitionId)?.vote;

  return {
    vote,
    hasVoted,
    getVoteType
  };
} 