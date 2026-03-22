export type IssueCategory = "pothole" | "streetlight" | "graffiti" | "other";

export type IssueStatus = "reported" | "in-progress" | "resolved";

export interface Issue {
  id: string;
  category: IssueCategory;
  description: string;
  photo: string;
  status: IssueStatus;
  location: string;
  votes: number;
  votedBy: string[];
  createdAt: Date;
  comments: Comment[];
  reportedBy?: string;
}

export interface Comment {
  id: string;
  issueId: string;
  author: string;
  text: string;
  createdAt: Date;
}
