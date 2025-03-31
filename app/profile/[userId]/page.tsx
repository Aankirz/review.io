"use client";

import { useState } from "react";
import { Container } from "@/components/Layout/Container";
import { reviews, users, products, comments } from "@/utils/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/Review/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Cake, Bookmark, FileText, MessageSquare, Link as LinkIcon, Calendar, Mail, Settings, Shield, Trophy } from "lucide-react";

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const [activeTab, setActiveTab] = useState("posts");
  
  const user = users.find((u) => u.id === params.userId);
  
  if (!user) {
    notFound();
  }

  const userReviews = reviews.filter((review) => review.userId === params.userId);
  const userComments = comments.filter((comment) => comment.userId === params.userId);
  
  // This would be from a real backend - mock data for saved posts
  const savedReviews = [...reviews].sort(() => 0.5 - Math.random()).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Container>
      <div className="container mx-auto max-w-6xl py-10 md:py-14 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - User Profile */}
          <div className="md:w-80 lg:w-96">
            <div className="sticky top-20 space-y-6">
              <Card className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary to-primary/60"></div>
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-10 left-6 ring-4 ring-background rounded-full overflow-hidden">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-20 h-20 object-cover" 
                    />
                  </div>
                  <div className="mt-12 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">@{user.username}</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit Profile</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">{user.karma}</span>
                        <span className="text-sm text-muted-foreground">karma</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Cake className="h-4 w-4" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                    
                    {user.bio && (
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                    )}
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Trophy Case
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3 text-center">
                      <div className="flex justify-center mb-2">
                        <span className="text-xl">🏆</span>
                      </div>
                      <span className="text-sm font-medium">Top Reviewer</span>
                    </div>
                    <div className="border rounded-md p-3 text-center">
                      <div className="flex justify-center mb-2">
                        <span className="text-xl">⭐</span>
                      </div>
                      <span className="text-sm font-medium">Helpful Votes</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Contact</h3>
                  <div className="space-y-3">
                    {user.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <Link href="#" className="text-primary hover:underline">review.io/u/{user.username}</Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Main Content - Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Posts
                  <span className="ml-1 rounded-full bg-muted px-2 text-xs">
                    {userReviews.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                  <span className="ml-1 rounded-full bg-muted px-2 text-xs">
                    {userComments.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Saved
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-8">
                {userReviews.length === 0 ? (
                  <Card className="p-10 text-center border-dashed">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-muted" />
                      <h3 className="text-xl font-semibold">No reviews yet</h3>
                      <p className="text-muted-foreground">This user hasn't posted any reviews yet.</p>
                      <Button>
                        <Link href="/products">Browse reviews</Link>
                      </Button>
                    </div>
                  </Card>
                ) : (
                  userReviews.map((review) => {
                    const product = products.find(p => p.id === review.productId);
                    if (!product) return null;

                    return (
                      <div key={review.id}>
                        <ReviewCard
                          review={review}
                          product={product}
                          author={user}
                          expandable={true}
                          showVoting={true}
                          showComments={true}
                        />
                      </div>
                    );
                  })
                )}
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-8">
                {userComments.length === 0 ? (
                  <Card className="p-10 text-center border-dashed">
                    <div className="flex flex-col items-center gap-4">
                      <MessageSquare className="h-12 w-12 text-muted" />
                      <h3 className="text-xl font-semibold">No comments yet</h3>
                      <p className="text-muted-foreground">This user hasn't made any comments yet.</p>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="divide-y">
                      {userComments.map((comment) => {
                        const review = reviews.find(r => r.id === comment.reviewId);
                        const product = review ? products.find(p => p.id === review.productId) : null;
                        
                        if (!review || !product) return null;
                        
                        return (
                          <div key={comment.id} className="p-6 space-y-3">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2 text-sm">
                                <Link href={`/product/${product.id}`} className="font-medium hover:underline">
                                  {product.name}
                                </Link>
                                <span className="text-muted-foreground">•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{comment.content}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                                {comment.upvotes} Upvotes
                              </Button>
                              <Link 
                                href={`/product/${product.id}`} 
                                className="text-xs text-primary hover:underline"
                              >
                                View full discussion
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="saved" className="space-y-8">
                {savedReviews.length === 0 ? (
                  <Card className="p-10 text-center border-dashed">
                    <div className="flex flex-col items-center gap-4">
                      <Bookmark className="h-12 w-12 text-muted" />
                      <h3 className="text-xl font-semibold">No saved posts</h3>
                      <p className="text-muted-foreground">Items you save will appear here.</p>
                    </div>
                  </Card>
                ) : (
                  savedReviews.map((review) => {
                    const product = products.find(p => p.id === review.productId);
                    const author = users.find(u => u.id === review.userId);
                    
                    if (!product || !author) return null;

                    return (
                      <div key={review.id}>
                        <ReviewCard
                          review={review}
                          product={product}
                          author={author}
                          expandable={true}
                          showVoting={true}
                          showComments={true}
                        />
                      </div>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
} 