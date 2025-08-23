import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageSquare, Mail } from 'lucide-react';

const FAQ = () => {
  const faqCategories = [
    {
      category: "Getting Started",
      badge: "Basics",
      questions: [
        {
          question: "What is RemnantHub?",
          answer: "RemnantHub is a platform designed to connect Christians with local communities, facilitate fellowship, and provide resources for spiritual growth. We help believers find and join local Christian gatherings, share prayer requests, and build meaningful relationships."
        },
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking the 'Sign Up' button in the top navigation. You'll need to provide your email address, create a password, and verify your email. Once verified, you can complete your profile and start exploring communities."
        },
        {
          question: "Is RemnantHub free to use?",
          answer: "Yes, RemnantHub is completely free to use. Our mission is to support the body of Christ, and we believe access to Christian fellowship should not be limited by financial barriers."
        }
      ]
    },
    {
      category: "Communities",
      badge: "Fellowship",
      questions: [
        {
          question: "How do I find communities near me?",
          answer: "Use our Search page to find communities in your area. You can filter by location, meeting days, community type, and other preferences. The interactive map shows communities visually, and you can click 'Find Near Me' to see the closest options."
        },
        {
          question: "What types of communities are available?",
          answer: "We host various types of Christian communities including Bible study groups, prayer groups, youth ministries, family fellowships, ministry teams, and denominational gatherings. Each community has different focuses and meeting schedules."
        },
        {
          question: "How do I join a community?",
          answer: "Click on any community from the search results or map to view details. If it interests you, click 'Join Community' and follow the prompts. Some communities may require approval from leaders, while others allow immediate joining."
        },
        {
          question: "Can I create my own community?",
          answer: "Yes! You can create and lead your own community. Go to your Dashboard and look for the 'Create Community' option. You'll need to provide details about your community, meeting times, location, and what to expect."
        }
      ]
    },
    {
      category: "Privacy & Safety",
      badge: "Security",
      questions: [
        {
          question: "How is my personal information protected?",
          answer: "We take privacy seriously. Your personal information is encrypted and stored securely. We never sell your data, and you control what information is visible to other community members. Read our Privacy Policy for complete details."
        },
        {
          question: "Who can see my profile information?",
          answer: "By default, other community members can see your display name and general location (city/state). You can adjust your privacy settings in your Dashboard to control what information is shared."
        },
        {
          question: "How do you handle inappropriate behavior?",
          answer: "We have community guidelines based on Christian principles. Users can report inappropriate content or behavior, and our moderation team reviews all reports within 24 hours. We take action ranging from warnings to account suspension depending on the severity."
        }
      ]
    },
    {
      category: "Technical Support",
      badge: "Help",
      questions: [
        {
          question: "The website isn't working properly. What should I do?",
          answer: "First, try refreshing the page or clearing your browser cache. If issues persist, check if you're using a supported browser (Chrome, Firefox, Safari, Edge). Contact our support team if problems continue."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Sign In' and then 'Forgot Password' on the auth page. Enter your email address and we'll send you a reset link. Check your spam folder if you don't see the email within a few minutes."
        },
        {
          question: "Can I use RemnantHub on my mobile device?",
          answer: "Yes! RemnantHub is fully responsive and works great on mobile devices. Simply visit our website in your mobile browser. We're also working on dedicated mobile apps for even better mobile experience."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <HelpCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about RemnantHub</p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">{category.category}</CardTitle>
                <Badge variant="secondary">{category.badge}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Still Need Help?</CardTitle>
            </div>
            <CardDescription>
              Can't find what you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
            <CardDescription>
              Learn about our community standards and expectations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Guidelines
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;