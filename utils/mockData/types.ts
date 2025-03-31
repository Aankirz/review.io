export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  createdAt: string;
  karma: number; // Reputation points
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  brand: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  title: string;
  content: string;
  rating: number; // 1-5 stars
  upvotes: number;
  downvotes: number;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt?: string;
  parentId?: string; // For nested comments
}

export interface Vote {
  id: string;
  userId: string;
  targetType: "review" | "comment";
  targetId: string;
  value: 1 | -1; // 1 for upvote, -1 for downvote
  createdAt: string;
} 