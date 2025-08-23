import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  Shield, 
  MessageSquare, 
  Calendar, 
  Search,
  Heart,
  BookOpen,
  Home,
  Star,
  Clock,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Discovery',
      description: 'Find house church communities near you with our interactive map and location-based search.',
      benefits: ['Real-time geolocation', 'Distance filtering', 'Neighborhood search', 'Interactive maps']
    },
    {
      icon: Shield,
      title: 'Trust & Verification System',
      description: 'Connect with confidence through our community trust levels and reference verification.',
      benefits: ['Community verification', 'Leader references', 'Member testimonials', 'Trust badges']
    },
    {
      icon: Search,
      title: 'Advanced Filtering',
      description: 'Find your perfect community match with detailed search filters and preferences.',
      benefits: ['Meeting time preferences', 'Biblical focus areas', 'Distance filtering', 'Leadership style']
    },
    {
      icon: MessageSquare,
      title: 'Secure Messaging',
      description: 'Connect with community leaders and members through our private messaging system.',
      benefits: ['Direct messaging', 'Group communications', 'Privacy controls', 'Contact management']
    },
    {
      icon: Users,
      title: 'Community Profiles',
      description: 'Detailed community pages with photos, leader bios, meeting information, and more.',
      benefits: ['Rich descriptions', 'Photo galleries', 'Leader profiles', 'Meeting schedules']
    },
    {
      icon: BookOpen,
      title: 'Biblical Focus',
      description: 'Connect based on apostolic teachings and New Testament church structure.',
      benefits: ['Scripture-centered fellowship', 'Apostolic teaching focus', 'Breaking bread together', 'Prayer partnerships']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Community Leader',
      content: 'RemnantHub helped us connect with seekers who truly value authentic fellowship. Our community has grown by 40% since joining.',
      community: 'Grace Family Fellowship'
    },
    {
      name: 'Michael Chen',
      role: 'Seeker',
      content: 'After moving to a new city, RemnantHub helped me find a house church that feels like family. The verification system gave me confidence.',
      community: 'Living Waters Fellowship'
    },
    {
      name: 'Pastor David Martinez',
      role: 'Network Coordinator',
      content: 'Managing multiple house churches is much easier with RemnantHub\'s tools. The platform truly understands our ministry model.',
      community: 'Austin House Church Network'
    }
  ];

  return (
    <div className="page-container bg-journey-light faded-overlay">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-glow">
            Connecting Authentic Christian Communities
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Built specifically for house churches following the New Testament model of fellowship, 
            teaching, breaking bread, and prayer.
          </p>
          <div className="divine-text mb-8">
            "And they devoted themselves to the apostles' teaching and the fellowship, 
            to the breaking of bread and the prayers."
            <br />
            <span className="text-primary font-semibold text-glow">- Acts 2:42 ESV</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for House Church Community
            </h2>
            <p className="text-xl text-muted-foreground">
              Purpose-built tools that understand the unique needs of intimate Christian fellowship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="community-card h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Levels */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Community Trust Levels
            </h2>
            <p className="text-xl text-muted-foreground">
              Our verification system helps you connect with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { level: 'New', color: 'bg-blue-100 text-blue-800', description: 'Recently joined communities building their presence' },
              { level: 'Established', color: 'bg-green-100 text-green-800', description: 'Active communities with consistent meeting history' },
              { level: 'Verified', color: 'bg-primary/10 text-primary', description: 'Reference-checked leaders and verified information' },
              { level: 'Endorsed', color: 'bg-purple-100 text-purple-800', description: 'Recommended by other trusted community leaders' }
            ].map((trust) => (
              <Card key={trust.level} className="text-center">
                <CardHeader>
                  <Badge className={`${trust.color} mx-auto mb-3 text-lg px-4 py-2`}>
                    {trust.level}
                  </Badge>
                  <CardDescription>{trust.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stories from Our Community
            </h2>
            <p className="text-xl text-muted-foreground">
              See how RemnantHub is helping believers find authentic fellowship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="community-card">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-primary">{testimonial.community}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Find Your Community?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of believers who have found their spiritual home through RemnantHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/search">
                <Search className="mr-2 h-5 w-5" />
                Start Searching
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth">
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;