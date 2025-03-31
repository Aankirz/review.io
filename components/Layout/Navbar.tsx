import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Search, Bell, Menu, LogIn } from "lucide-react";
import { users } from "@/utils/mockData";

export function Navbar() {
  // For demo purposes, use the first user as the current user
  const currentUser = users[0];
  const isLoggedIn = true; // For demo purposes

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6 mx-auto max-w-6xl">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">review.io</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-between">
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 rounded-md"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/products" 
              className="flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 rounded-md"
            >
              <Search className="mr-2 h-4 w-4" />
              Explore Reviews
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </Button>
                <Link href="/profile/1">
                  <Avatar className="h-8 w-8 border hover:ring-2 hover:ring-primary/20 transition-all">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/login" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 