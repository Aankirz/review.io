"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoteButtons } from "@/components/Review/VoteButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment, User } from "@/utils/mockData/types";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, SendHorizontal, ChevronDown, Reply } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  reviewId: string;
  comments: Comment[];
  currentUser?: User;
  onAddComment?: (reviewId: string, content: string, parentId?: string) => void;
  users: User[];
}

export function CommentSection({
  reviewId,
  comments,
  currentUser,
  onAddComment,
  users
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const { toast } = useToast();

  // Filter top-level comments
  const topLevelComments = comments.filter(comment => !comment.parentId);
  
  // Filter replies
  const getReplies = (commentId: string) => {
    return comments.filter(comment => comment.parentId === commentId);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    if (onAddComment) {
      onAddComment(reviewId, commentText);
    }
    
    // In a real app, we would add the comment via API
    // For now, just show a toast and clear the form
    toast({
      description: "Comment added successfully!",
      duration: 2000
    });
    
    setCommentText('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;
    
    if (onAddComment) {
      onAddComment(reviewId, replyText, parentId);
    }
    
    // In a real app, we would add the reply via API
    toast({
      description: "Reply added successfully!",
      duration: 2000
    });
    
    setReplyText('');
    setReplyToId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  // For the demo, show only first 3 comments if there are more than 3 and showAllComments is false
  const displayedComments = showAllComments 
    ? topLevelComments 
    : (topLevelComments.length > 3 ? topLevelComments.slice(0, 3) : topLevelComments);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>
      
      {currentUser && (
        <div className="flex gap-4 pt-2 pb-2">
          <Avatar className="w-9 h-9 border-2 border-background">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="resize-none min-h-[80px] focus-visible:ring-primary"
            />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                onClick={handleAddComment}
                className="gap-2 shadow-sm hover:shadow"
                disabled={!commentText.trim()}
              >
                Post Comment
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {displayedComments.length > 0 ? (
        <div className="space-y-4">
          {displayedComments.map(comment => {
            const user = getUserById(comment.userId);
            if (!user) return null;
            
            const replies = getReplies(comment.id);
            
            return (
              <div 
                key={comment.id} 
                className="border border-border/60 rounded-lg p-5 space-y-4 bg-gradient-to-r from-background to-muted/20 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 border-2 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <VoteButtons
                        reviewId={comment.id}
                        initialUpvotes={comment.upvotes}
                        initialDownvotes={comment.downvotes}
                      />
                      {currentUser && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                          className="gap-1 text-sm hover:bg-muted rounded-full px-3"
                        >
                          <Reply className="h-3.5 w-3.5" />
                          Reply
                        </Button>
                      )}
                    </div>
                    
                    {replyToId === comment.id && currentUser && (
                      <div className="mt-4 ml-2 p-3 border border-border/40 rounded-lg bg-muted/30 animate-in fade-in slide-in-from-top-5 duration-300">
                        <div className="flex gap-3">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{currentUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder={`Reply to ${user.name}...`}
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              className="resize-none text-sm min-h-[60px] bg-background/80 focus-visible:ring-primary"
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setReplyToId(null)}
                                className="text-xs h-8"
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleAddReply(comment.id)}
                                className="text-xs h-8 gap-1"
                                disabled={!replyText.trim()}
                              >
                                <SendHorizontal className="h-3 w-3" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Render replies */}
                    {replies.length > 0 && (
                      <div className={cn(
                        "ml-5 mt-5 space-y-4 border-l-2 border-primary/10 pl-4",
                        replies.length > 2 && "animate-in fade-in slide-in-from-left-5 duration-500"
                      )}>
                        {replies.map(reply => {
                          const replyUser = getUserById(reply.userId);
                          if (!replyUser) return null;
                          
                          return (
                            <div key={reply.id} className="space-y-2 hover:bg-muted/20 p-2 rounded-md transition-colors">
                              <div className="flex gap-3">
                                <Avatar className="w-7 h-7">
                                  <AvatarImage src={replyUser.avatar} alt={replyUser.name} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">{replyUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div>
                                    <span className="font-medium text-sm">{replyUser.name}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">{reply.content}</p>
                                  <div className="mt-2">
                                    <VoteButtons
                                      reviewId={reply.id}
                                      initialUpvotes={reply.upvotes}
                                      initialDownvotes={reply.downvotes}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20">
          <MessageSquare className="h-10 w-10 text-muted mx-auto mb-4" />
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
      
      {topLevelComments.length > 3 && !showAllComments && (
        <div className="text-center pt-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAllComments(true)}
            className="rounded-full shadow-sm hover:shadow gap-2"
          >
            Show All Comments ({topLevelComments.length})
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 