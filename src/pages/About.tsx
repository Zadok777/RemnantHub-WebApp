import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Target,
  Shield,
  Globe,
  Home,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Authentic Fellowship',
      description: 'We believe in genuine, Christ-centered relationships that go beyond Sunday services.',
    },
    {
      icon: BookOpen,
      title: 'Biblical Foundation',
      description: 'Everything we do is rooted in Scripture and the New Testament model of church.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Small, intimate gatherings where every member can participate and grow together.',
    },
    {
      icon: Shield,
      title: 'Safe Connections',
      description: 'Trusted verification processes to help you connect with confidence.',
    },
  ];

  const team = [
    {
      name: 'David Chen',
      role: 'Founder & CEO',
      bio: 'Former pastor turned tech entrepreneur, passionate about connecting believers in meaningful ways.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Sarah Martinez',
      role: 'Community Director',
      bio: 'House church leader for 12+ years, helping communities thrive through authentic relationships.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Michael Johnson',
      role: 'Product Manager',
      bio: 'Seminary graduate and software developer, bridging faith and technology.',
      image: '/api/placeholder/150/150'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Story & Mission
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            RemnantHub was born from a simple truth: authentic Christian fellowship happens best 
            in intimate, home-based communities where believers can truly know and be known.
          </p>
          <div className="scripture-text mb-8">
            "And let us consider how to stir up one another to love and good works, 
            not neglecting to meet together, as is the habit of some, but encouraging one another."
            <br />
            <span className="text-primary font-semibold">- Hebrews 10:24-25 ESV</span>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why RemnantHub Exists
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  In our increasingly disconnected world, many believers are longing for deeper, 
                  more authentic community. Yet finding the right house church can feel impossible.
                </p>
                <p>
                  We've seen too many people drift from church to church, never finding their 
                  spiritual family. Too many house churches remain isolated, missing opportunities 
                  to connect with seekers who share their values.
                </p>
                <p>
                  RemnantHub bridges this gap, creating trusted connections between believers 
                  and communities that prioritize intimate fellowship, biblical teaching, 
                  and genuine discipleship.
                </p>
              </div>
            </div>
            <div className="community-card">
              <div className="text-center p-8">
                <Target className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-lg text-muted-foreground">
                  To connect believers with authentic house church communities where they can 
                  experience the New Testament model of fellowship, teaching, breaking bread, 
                  and prayer together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground">
              These principles guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="community-card text-center h-full">
                  <CardHeader>
                    <div className="p-4 rounded-xl bg-primary/10 mx-auto mb-4 w-fit">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground">
              Believers and builders passionate about authentic Christian community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="community-card text-center">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/40 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Growing Together
            </h2>
            <p className="text-xl text-muted-foreground">
              See how God is using RemnantHub to build His kingdom.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: '50+', label: 'House Churches', icon: Home },
              { number: '500+', label: 'Active Members', icon: Users },
              { number: '25+', label: 'Cities Served', icon: Globe },
              { number: '100+', label: 'Connections Made', icon: Heart },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="community-card text-center">
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're seeking community or leading one, RemnantHub is here to help 
            you connect with authentic Christian fellowship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/search">
                Find Communities
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;