"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/Layout/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { products, reviews, users } from "@/utils/mockData";
import { ReviewCard } from "@/components/Review/ReviewCard";

export default function Home() {
  const [showGuide, setShowGuide] = useState(false);

  // Show the guide after a short delay when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Get top 4 products by rating for the featured section
  const featuredProducts = [...products]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);

  // Get trending reviews (reviews with most upvotes)
  const trendingReviews = [...reviews]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  return (
    <Container>
      <section className="py-20 md:py-28 lg:py-32 xl:py-36">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Real Reviews from Real People
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Find genuine product reviews and share your own experiences to help others make informed decisions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 relative">
              <div className="relative">
                <Button size="lg" asChild className="px-8 relative z-10">
                  <Link href="/products" id="explore-reviews-btn">Explore Reviews</Link>
                </Button>
                
                {/* Spotlight Guide Animation */}
                {showGuide && (
                  <div className="absolute inset-0 z-0">
                    <div className="absolute -inset-4 rounded-lg bg-primary/20 blur-sm animate-pulse"></div>
                    <div className="absolute -inset-1 rounded-lg border-2 border-primary"></div>
                  </div>
                )}
              </div>
              
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link href="/login">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Products
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
                Discover highly-rated products with genuine reviews from our community
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="group relative overflow-hidden rounded-lg border bg-background hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover transition-transform group-hover:scale-105 h-full w-full"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold tracking-tight text-lg">{product.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-muted-foreground">{product.brand}</span>
                    <div className="flex items-center">
                      <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                      <span className="ml-1 text-yellow-500">★</span>
                      <span className="ml-1 text-xs text-muted-foreground">({product.totalReviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Reviews Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trending Reviews</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              See what the community is talking about. These reviews are making an impact!
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {trendingReviews.map((review) => {
              const product = products.find(p => p.id === review.productId);
              const author = users.find(u => u.id === review.userId);
              
              if (!product || !author) return null;
              
              return (
                <div key={review.id}>
                  <ReviewCard
                    review={review}
                    product={product}
                    author={author}
                    expandable={false}
                    showVoting={false}
                    showComments={false}
                    isCompact={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why Choose review.io?
                </h2>
                <p className="text-muted-foreground text-lg max-w-[600px]">
                  We&apos;re on a mission to bring transparency to product reviews. No fake reviews, no paid endorsements - just honest opinions from real users.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Genuine Reviews</h3>
                  <p className="text-muted-foreground">
                    Community verified with upvote/downvote system.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Transparent</h3>
                  <p className="text-muted-foreground">
                    All reviews are from actual users, not paid promoters.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Community Driven</h3>
                  <p className="text-muted-foreground">
                    Join discussions and share your experiences.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold">Comprehensive</h3>
                  <p className="text-muted-foreground">
                    Detailed reviews with ratings, photos, and comments.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Review Community"
                className="rounded-xl object-cover w-full h-auto max-w-[550px]"
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
              />
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
