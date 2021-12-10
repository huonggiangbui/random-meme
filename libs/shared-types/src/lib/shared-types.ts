export type Metadata = {
  createdAt: Date;
  updatedAt: Date;
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memes: Meme[];
}

export interface Meme {
  id: string;
  owner: User;
  source: string;
  content?: string;

  upvotes: number;
  downvotes: number;
  categories?: string[];
  comments: Comment[];
  reported: Report[];
  metadata: Metadata
}

export interface Comment {
  owner: User;
  content: string;
  reported: Report[];
  metadata: Metadata;
}

export interface Report {
  content: string;
  metadata: Metadata;
}