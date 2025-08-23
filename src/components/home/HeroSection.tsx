import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-church-welcome-light faded-overlay">
      {/* Enhanced Spiritual Background with Additional Overlay */}
      <div className="absolute inset-0 spiritual-gradient"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading - Matching the reference design */}
        <blockquote className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
          "And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers."
        </blockquote>
        
        {/* Scripture Reference */}
        <p className="text-primary text-xl font-semibold mb-8">
          Acts 2:42 ESV
        </p>

        {/* Second Scripture Quote */}
        <blockquote className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          "Where two or three gather in my name, there am I with them."
        </blockquote>
        
        <p className="text-primary text-lg font-semibold mb-12">
          Matthew 18:20 NIV
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link to="/features">
              Explore Features
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;