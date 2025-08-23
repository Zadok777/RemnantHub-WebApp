import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;