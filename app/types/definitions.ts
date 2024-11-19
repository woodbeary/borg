export interface Definition {
  id?: string;
  term: string;
  definition: string;
  createdAt: string;
  votes: number;
  status?: 'approved' | 'pending';
  author?: string;
  isStatic?: boolean;
}

export interface VoteRecord {
  definitionId: string;
  vote: 'up' | 'down';
  timestamp: number;
} 