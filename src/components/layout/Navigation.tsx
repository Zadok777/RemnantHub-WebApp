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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - More compact layout */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            <img 
              src="/lovable-uploads/6c5c7043-4203-46aa-b99f-b705da559ade.png" 
              alt="RemnantHub Logo" 
              className="w-10 h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground leading-tight truncate">RemnantHub</h1>
              <p className="text-xs text-muted-foreground hidden sm:block leading-tight truncate">
                Connecting Communities
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            <ThemeToggle />
            {loading ? (
              <div className="w-16 h-8 bg-muted rounded animate-pulse" />
            ) : user ? (
              <>
                <span className="text-xs text-muted-foreground max-w-24 truncate hidden lg:block">
                  {user.user_metadata?.display_name || user.email}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center space-x-1">
                    <Settings className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline ml-1">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth" className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Sign In</span>
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth" className="flex items-center space-x-1">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden lg:inline">Sign Up</span>
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