import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, MapPin, Heart, BookOpen, Search, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const JourneySection = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-house-church-fellowship faded-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Journey Starts Here
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're seeking community or leading one, we're here to help
          </p>
        </div>

        {/* Two Main Sections */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Looking for Community */}
          <div className="community-card text-center">
            <div className="p-6 rounded-2xl bg-primary/10 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Looking for a Household of Faith?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Find authentic Christian fellowship in your area. Connect with house church assemblies and small gatherings that align with your spiritual journey.
            </p>
            <Button size="lg" asChild className="w-full">
              <Link to="/search">
                <Search className="mr-2 h-5 w-5" />
                Find a Gathering
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Search by location, denomination, meeting style, and more
            </p>
          </div>

          {/* Leading a House Church */}
          <div className="community-card text-center">
            <div className="p-6 rounded-2xl bg-secondary/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Plus className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Host an Ekklēsia?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Share your gathering with seekers in your area. Help others discover the authentic fellowship you've cultivated in your home.
            </p>
            <Button size="lg" variant="secondary" asChild className="w-full">
              <Link to={user ? "/create-community" : "/auth"}>
                <Plus className="mr-2 h-5 w-5" />
                Plant a House Church
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Free listing with verification process
            </p>
          </div>
        </div>

        {/* Built on Biblical Foundation Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Built on Biblical Foundation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Experience authentic Christian community rooted in scripture and early church principles
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Authentic Fellowship */}
            <div className="community-card text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Authentic Fellowship
              </h3>
              <blockquote className="text-muted-foreground italic mb-3">
                "Bear one another's burdens, and so fulfill the law of Christ."
              </blockquote>
              <p className="text-sm text-primary font-semibold mb-3">Galatians 6:2</p>
              <p className="text-muted-foreground">
                Discover genuine Christian community in intimate home gatherings
              </p>
            </div>

            {/* Biblical Foundation */}
            <div className="community-card text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Biblical Foundation
              </h3>
              <blockquote className="text-muted-foreground italic mb-3">
                "Let the word of Christ dwell in you richly, teaching and admonishing one another."
              </blockquote>
              <p className="text-sm text-primary font-semibold mb-3">Colossians 3:16</p>
              <p className="text-muted-foreground">
                Communities grounded in apostolic teaching and prayer
              </p>
            </div>

            {/* Breaking Bread Together */}
            <div className="community-card text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Breaking Bread Together
              </h3>
              <blockquote className="text-muted-foreground italic mb-3">
                "And day by day, attending the temple together and breaking bread in their homes."
              </blockquote>
              <p className="text-sm text-primary font-semibold mb-3">Acts 2:46</p>
              <p className="text-muted-foreground">
                Experience the early church model of home-centered worship
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;