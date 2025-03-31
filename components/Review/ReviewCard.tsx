"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButtons } from './VoteButtons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Calendar, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { Review, User, Product } from "@/utils/mockData/types";
import { Badge } from "@/components/ui/badge";

interface ReviewCardProps {
  review: Review;
  product: Product;
  author: User;
  expandable?: boolean;
  showVoting?: boolean;
  showComments?: boolean;
  isCompact?: boolean;
  onCommentClick?: (reviewId: string) => void;
  commentCount?: number;
}

export function ReviewCard({
  review,
  product,
  author,
  expandable = true,
  showVoting = true,
  showComments = true,
  isCompact = false,
  onCommentClick,
  commentCount = 0
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Determine if review content should be truncated
  const maxCharacters = isCompact ? 150 : 300;
  const shouldTruncate = expandable && review.content.length > maxCharacters && !isExpanded;
  const truncatedContent = shouldTruncate
    ? `${review.content.substring(0, maxCharacters)}...`
    : review.content;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine top-level sentiment based on rating
  const getSentimentBadge = () => {
    if (review.rating >= 4) return <Badge className="bg-green-500/90 hover:bg-green-500/90">Positive</Badge>;
    if (review.rating <= 2) return <Badge className="bg-red-500/90 hover:bg-red-500/90">Negative</Badge>;
    return <Badge className="bg-yellow-500/90 hover:bg-yellow-500/90">Neutral</Badge>;
  };

  return (
    <Card className={`h-full ${isCompact ? 'flex flex-col' : ''} border border-border/60 shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardHeader className={`${isCompact ? 'p-4 pb-2' : 'pb-3'} ${isCompact ? 'bg-muted/50' : 'bg-gradient-to-r from-muted/30 to-background'}`}>
        <div className={`flex ${isCompact ? 'flex-col' : 'flex-col md:flex-row md:items-start'} justify-between gap-3`}>
          <div className={`flex items-center gap-3`}>
            {!isCompact && (
              <Avatar className="w-10 h-10 border-2 border-background">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {isCompact ? (
                <Link href={`/product/${product.id}`}>
                  <CardTitle className="text-base hover:underline hover:text-primary transition-colors">{product.name}</CardTitle>
                </Link>
              ) : (
                <CardTitle className="text-lg">{review.title}</CardTitle>
              )}
              <CardDescription className="mt-1 flex items-center gap-2">
                {isCompact ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {formatDate(review.createdAt)}
                  </div>
                ) : (
                  <div className="flex items-center flex-wrap gap-2">
                    <span>By <Link href={`/profile/${author.id}`} className="hover:underline text-primary font-medium">{author.name}</Link></span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                    {!isCompact && getSentimentBadge()}
                  </div>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted stroke-muted"}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${isCompact ? 'p-4 pt-2 flex-1' : 'pt-4'}`}>
        {!isCompact && <h3 className="font-bold text-lg mb-3">{review.title}</h3>}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {truncatedContent}
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(true)} 
              className="ml-2 text-primary hover:underline font-medium inline-flex items-center"
            >
              Read more <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          )}
          {expandable && isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)} 
              className="ml-2 text-primary hover:underline font-medium inline-flex items-center"
            >
              Show less <ChevronUp className="h-4 w-4 ml-1" />
            </button>
          )}
        </p>
        {review.images && review.images.length > 0 && !isCompact && (
          <div className="mt-5">
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
              <ImageIcon className="h-4 w-4" />
              <span>Attached images ({review.images.length})</span>
            </div>
            <div className="flex gap-3 overflow-x-auto py-2 pb-1 scrollbar-hide">
              {review.images.map((image, i) => (
                <div key={i} className="relative group">
                  <img 
                    src={image} 
                    alt={`Review image ${i+1}`} 
                    className="w-24 h-24 object-cover rounded-md border border-muted transition-all duration-300 group-hover:shadow-md" 
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="sm" variant="secondary" className="text-xs px-2">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className={`${isCompact ? 'p-4 pt-0 mt-auto' : 'flex-col sm:flex-row sm:justify-between border-t pt-4'} gap-3`}>
        {showVoting && (
          <VoteButtons
            reviewId={review.id}
            initialUpvotes={review.upvotes}
            initialDownvotes={review.downvotes}
          />
        )}
        
        {showComments && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 hover:bg-muted/80"
            onClick={() => onCommentClick && onCommentClick(review.id)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>Comments{commentCount > 0 ? ` (${commentCount})` : ''}</span>
          </Button>
        )}
        
        {isCompact && (
          <Button variant="outline" asChild className="w-full mt-2 shadow-sm hover:shadow">
            <Link href={`/product/${product.id}`}>Read Full Review</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 