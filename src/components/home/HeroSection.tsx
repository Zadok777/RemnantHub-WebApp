import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import bibleBackground from '@/assets/bible-hands-background.jpg';
const HeroSection = () => {
  return <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted">
      {/* Faded Bible Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{
      backgroundImage: `url(${bibleBackground})`
    }}></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading - Matching the reference image */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
          <span className="block text-4xl">They devoted themselves to the apostles'</span>
          <span className="block">teaching and the fellowship, to the breaking of</span>
          <span className="block">bread and the prayers.</span>
        </h1>
        
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
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default HeroSection;