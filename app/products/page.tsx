"use client";

import { useState } from "react";
import { Container } from "@/components/Layout/Container";
import { products, reviews, users, comments as allComments } from "@/utils/mockData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/Review/ReviewCard";
import { CommentSection } from "@/components/Comment/CommentSection";
import { Card } from "@/components/ui/card";
import { Search, Filter, TrendingUp, Zap, Clock, Calendar, SortAsc, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ExploreReviewsPage() {
  const [sortOption, setSortOption] = useState<'trending' | 'newest' | 'top'>('trending');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const { toast } = useToast();

  // Get all categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  // For demo purposes, use the first user as the current user
  const currentUser = users[0];
  
  // Helper to get product data by ID
  const getProductById = (id: string) => products.find(p => p.id === id);
  
  // Helper to get user data by ID
  const getUserById = (id: string) => users.find(u => u.id === id);
  
  // Helper to get comments for a review
  const getReviewComments = (reviewId: string) => {
    return allComments.filter(comment => comment.reviewId === reviewId);
  };

  // Sort and filter reviews
  const filteredReviews = reviews.filter(review => 
    !filterCategory || getProductById(review.productId)?.category === filterCategory
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'top') {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else { // trending - combination of recency and vote count
      const aScore = a.upvotes - a.downvotes + (new Date(a.createdAt).getTime() / 100000000);
      const bScore = b.upvotes - b.downvotes + (new Date(b.createdAt).getTime() / 100000000);
      return bScore - aScore;
    }
  });

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

  return (
    <Container>
      <div className="mx-auto max-w-6xl py-10 px-4">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter mb-2">Explore Reviews</h1>
              <p className="text-muted-foreground text-lg">Discover reviews from the community</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="pl-9 pr-4 py-2 w-full md:w-[300px] rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/30 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
            <div className="space-y-4">
              {/* Sort options */}
              <div className="flex justify-between items-center py-2 border-b" id="feed-sorting">
                <div className="flex gap-1">
                  <Button
                    variant={sortOption === 'trending' ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full gap-1.5"
                    onClick={() => setSortOption('trending')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </Button>
                  <Button
                    variant={sortOption === 'newest' ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full gap-1.5"
                    onClick={() => setSortOption('newest')}
                  >
                    <Clock className="h-4 w-4" />
                    New
                  </Button>
                  <Button
                    variant={sortOption === 'top' ? "default" : "ghost"}
                    size="sm"
                    className="rounded-full gap-1.5"
                    onClick={() => setSortOption('top')}
                  >
                    <Zap className="h-4 w-4" />
                    Top
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full gap-1.5"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Posts feed */}
              <div className="space-y-6">
                {sortedReviews.length === 0 ? (
                  <Card className="p-10 text-center border-dashed">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-5 rounded-full bg-primary/10">
                        <Star className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">No reviews found</h3>
                      <p className="text-muted-foreground">Try changing your filters or search query</p>
                    </div>
                  </Card>
                ) : (
                  sortedReviews.map(review => {
                    const product = getProductById(review.productId);
                    const author = getUserById(review.userId);
                    
                    if (!product || !author) return null;
                    
                    const reviewComments = getReviewComments(review.id);
                    const showComments = activeComments === review.id;

                    return (
                      <div key={review.id} className="space-y-2">
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
                  })
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="bg-primary p-6 text-primary-foreground">
                  <h3 className="font-semibold text-lg">About Explore Reviews</h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Discover genuine product reviews shared by our community. Vote on the most helpful reviews and join the conversation.
                  </p>
                  <Button className="w-full">Create a Review</Button>
                </div>
              </Card>

              <Card>
                <div className="p-6 space-y-4" id="categories-filter">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Category
                  </h3>
                  <div className="space-y-2">
                    <Button 
                      variant={filterCategory === null ? "default" : "outline"} 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setFilterCategory(null)}
                    >
                      All Categories
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={filterCategory === category ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setFilterCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Products
                  </h3>
                  <div className="space-y-4">
                    {products
                      .sort((a, b) => b.averageRating - a.averageRating)
                      .slice(0, 5)
                      .map(product => (
                        <Link 
                          key={product.id} 
                          href={`/product/${product.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-xs">★</span>
                              <span className="text-xs">{product.averageRating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({product.totalReviews} reviews)</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 