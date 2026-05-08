export interface User {
  id: number;
  name: string;
  email: string;
  headline: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  categories: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Post {
  id: number;
  userId: number;
  userName: string;
  userAvatarUrl: string;
  content: string;
  mediaUrl: string;
  mediaType: string;
  category: string;
  challengeId: number | null;
  isFromChallenge: boolean;
  challengeDayNumber: number | null;
  applaudCount: number;
  commentCount: number;
  applaudedByMe: boolean;
  createdAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatarUrl: string;
  content: string;
  createdAt: string;
}

export interface Challenge {
  id: number;
  userId: number;
  userName: string;
  title: string;
  category: string;
  description: string;
  durationDays: number;
  startDate: string;
  currentDay: number;
  completedDays: number;
  streakDays: number;
  progressPercent: number;
  createdAt: string;
}

export interface ChallengeEntry {
  id: number;
  challengeId: number;
  dayNumber: number;
  note: string;
  mediaUrl: string;
  mediaType: string;
  sharedToFeed: boolean;
  createdAt: string;
}

export interface Institution {
  id: number;
  name: string;
  category: string;
  description: string;
  location: string;
  logoUrl: string;
  courses: string[];
  achievements: string[];
  successStories: string[];
  memberCount: number;
  joinedByMe: boolean;
}

export interface ProfileResponse {
  user: User;

  stats: {
    posts: number;
    challenges: number;
    followers: number;
    following: number;
  };

  iFollowThem: boolean;
}

export interface FollowListItem {
  id: number;
  name: string;
  email?: string;
  headline?: string;
  avatarUrl?: string;
  iFollowThem: boolean;
  isMyFollower?: boolean;   // only present on /followers response
  canUnfollow?: boolean;    // only present on /following response
}

export const CATEGORIES = ['Art', 'Music', 'Dance', 'Code', 'Photography', 'Writing', 'Fitness', 'Cooking'];