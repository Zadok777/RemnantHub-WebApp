import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  DollarSign, 
  Users, 
  Target,
  Shield,
  Globe,
  Home,
  ChevronRight,
  Check,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate = () => {
  const impactAreas = [
    {
      icon: Globe,
      title: 'Platform Development',
      description: 'Continued improvement of search, messaging, and community features.',
      goal: '$25,000',
      raised: '$8,500'
    },
    {
      icon: Shield,
      title: 'Security & Trust',
      description: 'Enhanced verification systems and safety measures for community connections.',
      goal: '$15,000', 
      raised: '$4,200'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Resources and training for house church leaders and community builders.',
      goal: '$10,000',
      raised: '$6,800'
    },
  ];

  const donationTiers = [
    {
      amount: '$25',
      title: 'Community Supporter',
      description: 'Help us maintain our servers and basic platform operations.',
      benefits: ['Platform access', 'Email updates', 'Community supporter badge']
    },
    {
      amount: '$50',
      title: 'Fellowship Builder',
      description: 'Support new feature development and community growth initiatives.',
      benefits: ['All Supporter benefits', 'Early feature access', 'Quarterly impact reports']
    },
    {
      amount: '$100',
      title: 'Mission Partner',
      description: 'Enable us to expand to new cities and support more communities.',
      benefits: ['All Builder benefits', 'Direct line to team', 'Annual partner call'],
      popular: true
    },
    {
      amount: '$250',
      title: 'Kingdom Investor',
      description: 'Champion our mission to connect believers in authentic fellowship.',
      benefits: ['All Partner benefits', 'Advisory input', 'Recognition on donor wall']
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Support the Mission
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Help us connect believers worldwide through authentic house church communities. 
            Your partnership enables us to build tools that strengthen the body of Christ.
          </p>
          <div className="scripture-text mb-8">
            "Each of you should give what you have decided in your heart to give, 
            not reluctantly or under compulsion, for God loves a cheerful giver."
            <br />
            <span className="text-primary font-semibold">- 2 Corinthians 9:7</span>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Where Your Support Goes
            </h2>
            <p className="text-xl text-muted-foreground">
              Every donation directly supports our mission to connect believers in meaningful fellowship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {impactAreas.map((area) => {
              const Icon = area.icon;
              const percentage = Math.round((parseInt(area.raised.replace(/[$,]/g, '')) / parseInt(area.goal.replace(/[$,]/g, ''))) * 100);
              
              return (
                <Card key={area.title} className="community-card">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{area.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base mb-4">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Raised: {area.raised}</span>
                        <span className="text-muted-foreground">Goal: {area.goal}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-center text-primary font-semibold">
                        {percentage}% funded
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Partnership Level
            </h2>
            <p className="text-xl text-muted-foreground">
              Join believers from around the world supporting authentic Christian community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier) => (
              <Card 
                key={tier.amount} 
                className={`community-card relative ${tier.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{tier.amount}</div>
                  <CardTitle className="text-xl">{tier.title}</CardTitle>
                  <CardDescription className="text-base">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    <Gift className="w-4 h-4 mr-2" />
                    Give {tier.amount}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Amount */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="community-card text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Give a Custom Amount
            </h3>
            <p className="text-muted-foreground mb-6">
              Every gift, no matter the size, helps us advance the mission of connecting believers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input 
                    type="number" 
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <Button size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Give Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How is RemnantHub funded?",
                answer: "RemnantHub is funded entirely through donations from believers who share our vision. We do not charge communities or take commissions from connections."
              },
              {
                question: "Is my donation tax-deductible?",
                answer: "RemnantHub is currently organized as a mission-driven organization. We are working toward 501(c)(3) status to make donations tax-deductible."
              },
              {
                question: "How do you ensure transparency?",
                answer: "We provide quarterly impact reports to all donors showing exactly how funds are used, communities served, and platform improvements made."
              },
              {
                question: "Can I donate items or services instead of money?",
                answer: "Yes! We welcome in-kind donations of professional services, especially in areas of technology, marketing, and ministry development."
              }
            ].map((faq, index) => (
              <Card key={index} className="community-card">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
            Partner With Us Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the movement to connect believers in authentic, biblical community. 
            Your support makes eternal impact possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Gift className="mr-2 h-5 w-5" />
              Make a Donation
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;