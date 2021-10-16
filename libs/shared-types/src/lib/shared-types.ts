export type Metadata = {
  createdAt: Date;
  updatedAt: Date;
};

export interface User {
  name: string;
  email: string;
  avatar?: File;
  memes: Meme[];
}

export interface Meme {
  owner: User;
  source: string | File;
  content: string;

  upvotes: number;
  downvotes: number;
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