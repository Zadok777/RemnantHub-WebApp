import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, MapPin, Heart, BookOpen } from 'lucide-react';

const JourneySection = () => {
  const features = [
    {
      icon: Users,
      title: 'Find Your Community',
      description: 'Connect with authentic house church communities in your area that share your faith and values.',
      color: 'text-primary'
    },
    {
      icon: MapPin,
      title: 'Local Fellowship',
      description: 'Discover intimate gatherings in homes where believers break bread and pray together.',
      color: 'text-secondary'
    },
    {
      icon: Heart,
      title: 'Spiritual Growth',
      description: 'Experience the New Testament model of church - personal, relational, and transformative.',
      color: 'text-primary'
    },
    {
      icon: BookOpen,
      title: 'Biblical Foundation',
      description: 'Join communities rooted in apostolic teaching and authentic Christian fellowship.',
      color: 'text-secondary'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Journey Starts Here
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're seeking community or leading one, we're here to help you connect with authentic Christian fellowship in the tradition of the early church.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLeft = index % 2 === 0;
            
            return (
              <div 
                key={feature.title} 
                className={`community-card flex items-start space-x-6 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse md:space-x-reverse'
                }`}
              >
                <div className={`p-4 rounded-2xl ${isLeft ? 'bg-primary/10' : 'bg-secondary/30'}`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="community-card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Find Your Community?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of believers who have found their spiritual home through RemnantHub. Start your journey toward authentic Christian fellowship today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/search">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Communities Near Me
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;