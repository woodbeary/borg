export interface Definition {
  id?: string;
  term: string;
  definition: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
} 