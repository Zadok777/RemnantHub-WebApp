import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, Zap, Info, Heart, User, UserPlus, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Prayer', href: '/prayers', icon: Heart },
    { name: 'Features', href: '/features', icon: Zap },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Donate', href: '/donate', icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo - Compact but with full text */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            <img 
              src="/lovable-uploads/3c84f68c-03b5-4889-906e-f88709ab46b7.png" 
              alt="RemnantHub Logo" 
              className="w-12 h-12 flex-shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-foreground leading-tight">RemnantHub</h1>
              <p className="text-xs text-muted-foreground hidden sm:block leading-tight">
                Connecting Authentic Christian Communities
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - More compact */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3 flex-shrink-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-1 lg:px-2 py-1 rounded-lg text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - More compact */}
          <div className="hidden md:flex items-center space-x-1 flex-shrink-0">
            <ThemeToggle />
            {loading ? (
              <div className="w-12 h-8 bg-muted rounded animate-pulse" />
            ) : user ? (
              <>
                <span className="text-xs text-muted-foreground max-w-20 truncate hidden xl:block">
                  {user.user_metadata?.display_name || user.email}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center space-x-1 px-1 lg:px-2">
                    <Settings className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden xl:inline text-xs">Dashboard</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="px-1 lg:px-2">
                  <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden xl:inline ml-1 text-xs">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="px-1 lg:px-2">
                  <Link to="/auth" className="flex items-center space-x-1">
                    <User className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden xl:inline text-xs">Sign In</span>
                  </Link>
                </Button>
                <Button size="sm" asChild className="px-1 lg:px-2">
                  <Link to="/auth" className="flex items-center space-x-1">
                    <UserPlus className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden xl:inline text-xs">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {loading ? (
                <div className="w-full h-8 bg-muted rounded animate-pulse" />
              ) : user ? (
                <>
                  <p className="text-sm text-muted-foreground px-3">
                    Welcome, {user.user_metadata?.display_name || user.email}
                  </p>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;