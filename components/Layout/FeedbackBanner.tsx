"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Info } from "lucide-react";
import Link from "next/link";

export function FeedbackBanner() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    // Check if banner has been dismissed before
    const dismissed = localStorage.getItem('feedbackBannerDismissed');
    
    if (!dismissed) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('feedbackBannerDismissed', 'true');
  };
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  if (!visible) return null;
  
  if (collapsed) {
    return (
      <div className="fixed bottom-4 left-4 z-40 animate-in fade-in duration-300">
        <Button 
          size="lg" 
          className="rounded-full shadow-lg gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={toggleCollapse}
        >
          <Info className="h-5 w-5" />
          <span>New Feature</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-6 left-6 right-6 z-40 animate-in slide-in-from-bottom duration-500 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl shadow-xl">
        <div className="p-4 md:p-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 pr-8">
              <h3 className="font-bold text-lg">Discover our Reddit-style Review Feed</h3>
              <p className="text-primary-foreground/80 mt-1 text-sm">
                Browse through community reviews, vote on helpful content, and join the conversation!
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm" 
                asChild
                className="whitespace-nowrap gap-2 font-medium"
              >
                <Link href="/products">
                  Explore Reviews
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-full hover:bg-primary-foreground/10 p-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          
          <button 
            onClick={toggleCollapse}
            className="absolute bottom-3 right-3 text-xs underline text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
} 