import { authStore } from "./auth-store";
import { Comment, Issue } from "./types";

const initialIssues: Issue[] = [
  {
    id: "1",
    category: "pothole",
    description:
      "Large pothole on Main Street causing damage to vehicles. About 2 feet wide and 6 inches deep.",
    photo:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    status: "in-progress",
    location: "Main Street & 5th Ave",
    votes: 24,
    votedBy: ["user-456", "user-789"],
    createdAt: new Date("2026-02-25"),
    comments: [
      {
        id: "c1",
        issueId: "1",
        author: "Sarah Chen",
        text: "This has been here for weeks! Thanks for reporting.",
        createdAt: new Date("2026-02-26"),
      },
      {
        id: "c2",
        issueId: "1",
        author: "City Works Dept",
        text: "We have scheduled repairs for next week. Thank you fro your patience.",
        createdAt: new Date("2026-02-27"),
      },
    ],
  },
];

class IssueStore {
  private issues: Issue[] = initialIssues;
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getIssues(): Issue[] {
    return this.issues;
  }

  getIssue(id: string): Issue | undefined {
    return this.issues.find((issue) => issue.id === id);
  }

  addIssue(
    issue: Omit<Issue, "id" | "votes" | "votedBy" | "createdAt" | "comments">,
  ): Issue {
    const newIssue: Issue = {
      ...issue,
      id: Date.now().toString(),
      votes: 0,
      votedBy: [],
      createdAt: new Date(),
      comments: [],
    };

    this.issues = [newIssue, ...this.issues];
    this.notify();

    return newIssue;
  }

  deleteIssue(issueId: string) {
    this.issues = this.issues.filter((issue) => issue.id !== issueId);
    this.notify();
  }

  toggleVote(issueId: string, userId: string) {
    this.issues = this.issues.map((issue) => {
      if (issue.id === issueId) {
        const hasVoted = issue.votedBy.includes(userId);
        return {
          ...issue,
          votes: hasVoted ? issue.votes - 1 : issue.votes + 1,
          votedBy: hasVoted
            ? issue.votedBy.filter((id) => id !== userId)
            : [...issue.votedBy, userId],
        };
      }

      return issue;
    });

    this.notify();
  }

  addComment(issueId: string, text: string, author: string) {
    this.issues = this.issues.map((issue) => {
      if (issue.id === issueId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          issueId,
          author,
          text,
          createdAt: new Date(),
        };

        return {
          ...issue,
          comments: [...issue.comments, newComment],
        };
      }

      return issue;
    });

    this.notify();
  }

  updateIssueAuthor(issueId: string) {
    const user = authStore.getCurrentUser();
    if (!user) return;

    this.issues = this.issues.map((issue) => {
      if (issue.id === issueId && issue.comments.length === 0) {
        const authorComment: Comment = {
          id: `author-${Date.now()}`,
          issueId,
          author: user.username,
          text: `Issue reported by ${user.username}`,
          createdAt: new Date(),
        };

        return {
          ...issue,
          comments: [authorComment],
        };
      }

      return issue;
    });

    this.notify();
  }
}

export const issueStore = new IssueStore();
