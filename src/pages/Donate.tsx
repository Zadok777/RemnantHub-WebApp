import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  DollarSign, 
  Check,
  Gift
} from 'lucide-react';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  
  const donationAmounts = [10, 25, 50, 100, 250];

  return (
    <div className="page-container bg-peaceful-waters faded-overlay">
      {/* Hero Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-glow">
            Support RemnantHub
          </h1>
          <div className="divine-text mb-8">
            Help us connect faith communities and spread the Gospel by supporting our mission
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              RemnantHub exists to help believers find authentic Christian communities, connect with like-minded faithful, and grow in their spiritual journey together.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Amounts */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Donation Amount
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {donationAmounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                variant={selectedAmount === amount ? "default" : "outline"}
                className="h-16 text-lg font-semibold"
              >
                ${amount}
              </Button>
            ))}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Custom Amount</h3>
            <div className="max-w-xs mx-auto">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input 
                  type="number" 
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Impact */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="community-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center text-lg">
                  <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  Help maintain and improve our platform
                </li>
                <li className="flex items-center text-lg">
                  <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  Support community verification processes
                </li>
                <li className="flex items-center text-lg">
                  <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  Enable new features for better connections
                </li>
                <li className="flex items-center text-lg">
                  <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  Spread the Gospel through technology
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Donate Button */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Button size="lg" className="text-lg px-8 py-4">
            <Gift className="mr-2 h-5 w-5" />
            Donate ${customAmount || selectedAmount}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Donate;