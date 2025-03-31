"use client";

import { useState } from "react";
import { Container } from "@/components/Layout/Container";
import { products, reviews, users, comments as allComments } from "@/utils/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "@/components/Review/ReviewForm";
import { ReviewCard } from "@/components/Review/ReviewCard";
import { CommentSection } from "@/components/Comment/CommentSection";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Star } from "lucide-react";

interface ProductPageClientProps {
  id: string;
}

export function ProductPageClient({ id }: ProductPageClientProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const { toast } = useToast();

  const product = products.find((p) => p.id === id);
  
  if (!product) {
    notFound();
  }

  const productReviews = reviews.filter((review) => review.productId === id);

  // For demo purposes, use the first user as the current user
  const currentUser = users[0];

  const handleAddReview = () => {
    // In a real app, we would make an API call to add the review
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });
    setShowReviewForm(false);
  };

  const toggleComments = (reviewId: string) => {
    if (activeComments === reviewId) {
      setActiveComments(null);
    } else {
      setActiveComments(reviewId);
    }
  };

  const handleAddComment = (reviewId: string, content: string, parentId?: string) => {
    // In a real app, we would make an API call to add the comment
    console.log(`Added comment to review ${reviewId}: ${content}${parentId ? ` in reply to ${parentId}` : ''}`);
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };

  const getReviewComments = (reviewId: string) => {
    return allComments.filter(comment => comment.reviewId === reviewId);
  };

  // Sort reviews by most recent
  const sortedReviews = [...productReviews].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-gradient-to-b from-background to-muted/30">
      <Container>
        <div className="container mx-auto max-w-6xl py-10 md:py-14 px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 border border-muted rounded-full py-2 px-4 hover:bg-background/80">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border shadow-sm bg-background">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-cover w-full h-full transition-transform hover:scale-105 duration-500" 
                />
                <div className="absolute top-4 right-4 bg-black/60 text-white rounded-full py-1 px-3 text-sm font-medium backdrop-blur-sm">
                  {product.category}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground font-medium mb-2">{product.brand}</div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
              </div>
              
              <div className="flex items-center gap-3 border-b border-muted pb-5">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(product.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted stroke-muted"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.totalReviews} reviews)</span>
              </div>
              
              <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
              
              <div className="flex flex-wrap gap-6 py-4 border-t border-muted">
                <div className="space-y-1">
                  <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Brand</div>
                  <div className="font-medium">{product.brand}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Category</div>
                  <div className="font-medium">{product.category}</div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <Button size="lg" onClick={() => setShowReviewForm(!showReviewForm)} className="shadow-sm transition-all hover:shadow">
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#reviews">Read Reviews</Link>
                </Button>
              </div>
            </div>
          </div>

          {showReviewForm && (
            <div className="mt-12">
              <Card className="p-6 shadow-md border-muted/60">
                <h3 className="text-xl font-bold mb-6">Share Your Experience</h3>
                <ReviewForm 
                  productId={product.id} 
                  onSubmit={handleAddReview} 
                  onCancel={() => setShowReviewForm(false)} 
                />
              </Card>
            </div>
          )}

          <div className="mt-24" id="reviews">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Reviews ({productReviews.length})</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full">Most Helpful</Button>
                <Button variant="outline" size="sm" className="rounded-full bg-primary/10">Recent</Button>
                <Button variant="outline" size="sm" className="rounded-full">Highest Rated</Button>
              </div>
            </div>

            {sortedReviews.length === 0 ? (
              <Card className="p-10 text-center bg-gradient-to-b from-background to-muted/50 border-dashed">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-5 rounded-full bg-primary/10">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No reviews yet</h3>
                  <p className="text-muted-foreground">Be the first to review this product!</p>
                  <Button 
                    onClick={() => setShowReviewForm(true)}
                    className="mt-4"
                  >
                    Write a Review
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-8">
                {sortedReviews.map((review) => {
                  const author = users.find((user) => user.id === review.userId);
                  if (!author) return null;

                  const reviewComments = getReviewComments(review.id);
                  const showComments = activeComments === review.id;

                  return (
                    <div key={review.id} className="transition-all">
                      <ReviewCard 
                        review={review}
                        product={product}
                        author={author}
                        commentCount={reviewComments.length}
                        onCommentClick={toggleComments}
                      />
                      
                      {showComments && (
                        <Card className="mt-2 p-6 shadow-md border-muted/60 animate-in fade-in slide-in-from-top-2 duration-300">
                          <CommentSection
                            reviewId={review.id}
                            comments={reviewComments}
                            currentUser={currentUser}
                            onAddComment={handleAddComment}
                            users={users}
                          />
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 