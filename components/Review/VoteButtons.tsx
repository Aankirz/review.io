"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  reviewId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  onVote?: (reviewId: string, voteType: 'upvote' | 'downvote') => void;
}

export function VoteButtons({
  reviewId,
  initialUpvotes,
  initialDownvotes,
  onVote
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const { toast } = useToast();

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    // If user already voted this way, remove their vote
    if (userVote === voteType) {
      if (voteType === 'upvote') {
        setUpvotes(prev => prev - 1);
      } else {
        setDownvotes(prev => prev - 1);
      }
      setUserVote(null);
      
      if (onVote) {
        onVote(reviewId, voteType);
      }
      
      return;
    }
    
    // If user is changing their vote
    if (userVote) {
      if (userVote === 'upvote') {
        setUpvotes(prev => prev - 1);
        setDownvotes(prev => prev + 1);
      } else {
        setUpvotes(prev => prev + 1);
        setDownvotes(prev => prev - 1);
      }
    } else {
      // First time voting
      if (voteType === 'upvote') {
        setUpvotes(prev => prev + 1);
      } else {
        setDownvotes(prev => prev + 1);
      }
    }
    
    setUserVote(voteType);
    
    if (onVote) {
      onVote(reviewId, voteType);
    }
    
    toast({
      description: voteType === 'upvote' 
        ? "Thanks for marking this review as helpful!" 
        : "Thanks for your feedback on this review.",
      duration: 2000
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-8 px-4 rounded-full flex items-center gap-2 transition-all border-muted shadow-sm hover:shadow", 
            userVote === 'upvote' && "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400"
          )}
          onClick={() => handleVote('upvote')}
        >
          <ThumbsUp className={cn(
            "h-4 w-4", 
            userVote === 'upvote' ? "fill-green-500 text-green-500" : "text-muted-foreground"
          )} />
          <span className="font-medium">{upvotes}</span>
        </Button>
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none dark:bg-green-900 dark:text-green-100">
          Helpful
        </span>
      </div>
      
      <div className="relative group">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-8 px-4 rounded-full flex items-center gap-2 transition-all border-muted shadow-sm hover:shadow", 
            userVote === 'downvote' && "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400"
          )}
          onClick={() => handleVote('downvote')}
        >
          <ThumbsDown className={cn(
            "h-4 w-4", 
            userVote === 'downvote' ? "fill-red-500 text-red-500" : "text-muted-foreground"
          )} />
          <span className="font-medium">{downvotes}</span>
        </Button>
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none dark:bg-red-900 dark:text-red-100">
          Not Helpful
        </span>
      </div>
    </div>
  );
} 