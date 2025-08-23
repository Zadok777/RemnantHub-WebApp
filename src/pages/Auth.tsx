import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, Check, Plus, Home, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Community creation state
  const [isLeader, setIsLeader] = useState(false);
  const [communities, setCommunities] = useState([{
    name: '',
    description: '',
    locationCity: '',
    locationState: '',
    meetingDay: '',
    meetingTime: '',
    contactInfo: '',
    maxCapacity: 20
  }]);
  const [leadershipVerification, setLeadershipVerification] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        // Force page reload for clean state
        window.location.href = '/';
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const addCommunity = () => {
    setCommunities([...communities, {
      name: '',
      description: '',
      locationCity: '',
      locationState: '',
      meetingDay: '',
      meetingTime: '',
      contactInfo: '',
      maxCapacity: 20
    }]);
  };

  const removeCommunity = (index: number) => {
    if (communities.length > 1) {
      setCommunities(communities.filter((_, i) => i !== index));
    }
  };

  const updateCommunity = (index: number, field: string, value: any) => {
    const updated = communities.map((community, i) => 
      i === index ? { ...community, [field]: value } : community
    );
    setCommunities(updated);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate community leader info if applicable
    if (isLeader) {
      if (!leadershipVerification.trim()) {
        setError('Please provide leadership verification information');
        setLoading(false);
        return;
      }
      
      const incompleteCommunities = communities.some(c => 
        !c.name.trim() || !c.locationCity.trim() || !c.locationState.trim() || 
        !c.meetingDay || !c.meetingTime.trim()
      );
      
      if (incompleteCommunities) {
        setError('Please complete all community information');
        setLoading(false);
        return;
      }
    }

    try {
      // Clean up existing state
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || undefined,
            is_leader: isLeader,
            leadership_verification: isLeader ? leadershipVerification : undefined,
            communities_to_create: isLeader ? communities : undefined
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        setSuccess(isLeader 
          ? 'Please check your email and click the confirmation link. Your community leadership application will be reviewed after email verification.' 
          : 'Please check your email and click the confirmation link to complete your registration.'
        );
        // Switch to sign in tab after showing success message
        setTimeout(() => {
          setActiveTab('signin');
          setSuccess('');
        }, 5000);
      } else if (data.user) {
        toast({
          title: "Account created!",
          description: isLeader ? "Welcome to RemnantHub. Your leadership application is under review." : "Welcome to RemnantHub.",
        });
        // Force page reload for clean state
        window.location.href = '/';
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container bg-peaceful-waters faded-overlay flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to RemnantHub</h1>
          <p className="text-muted-foreground">
            Join the community of believers gathering in homes
          </p>
          <div className="divine-text mt-4 text-sm">
            "And they devoted themselves to the apostles' teaching and the fellowship,<br />
            to the breaking of bread and the prayers."<br />
            <span className="text-primary font-semibold text-glow">- Acts 2:42 ESV</span>
          </div>
        </div>

        <Card className="community-card">
          <CardHeader className="text-center pb-4">
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display Name (Optional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Community Leadership Section */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="leader-option" 
                        checked={isLeader}
                        onCheckedChange={(checked) => setIsLeader(checked === true)}
                      />
                      <Label htmlFor="leader-option" className="text-sm font-medium">
                        I am planning to lead a community
                      </Label>
                    </div>

                    {isLeader && (
                      <div className="space-y-4 bg-secondary/30 p-4 rounded-md">
                        <div className="space-y-2">
                          <Label htmlFor="leadership-verification">Leadership Verification</Label>
                          <Textarea
                            id="leadership-verification"
                            placeholder="Please describe your ministry experience, biblical knowledge, or pastoral references that qualify you to lead a community..."
                            value={leadershipVerification}
                            onChange={(e) => setLeadershipVerification(e.target.value)}
                            className="min-h-20"
                          />
                          <p className="text-xs text-muted-foreground">
                            This helps us verify qualified leadership for biblical community oversight.
                          </p>
                        </div>

                        {/* Communities to Create */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Communities to Create</Label>
                          
                          {communities.map((community, index) => (
                            <Card key={index} className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <Home className="w-4 h-4" />
                                  Community {index + 1}
                                </h4>
                                {communities.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCommunity(index)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <Label className="text-xs">Community Name</Label>
                                  <Input
                                    placeholder="e.g., Riverside Fellowship"
                                    value={community.name}
                                    onChange={(e) => updateCommunity(index, 'name', e.target.value)}
                                    className="text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <Label className="text-xs">Description</Label>
                                  <Textarea
                                    placeholder="Brief description of your community's focus and culture..."
                                    value={community.description}
                                    onChange={(e) => updateCommunity(index, 'description', e.target.value)}
                                    className="text-sm min-h-16"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      City
                                    </Label>
                                    <Input
                                      placeholder="City"
                                      value={community.locationCity}
                                      onChange={(e) => updateCommunity(index, 'locationCity', e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">State</Label>
                                    <Input
                                      placeholder="State"
                                      value={community.locationState}
                                      onChange={(e) => updateCommunity(index, 'locationState', e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      Meeting Day
                                    </Label>
                                    <Select 
                                      value={community.meetingDay}
                                      onValueChange={(value) => updateCommunity(index, 'meetingDay', value)}
                                    >
                                      <SelectTrigger className="text-sm">
                                        <SelectValue placeholder="Day" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Sunday">Sunday</SelectItem>
                                        <SelectItem value="Monday">Monday</SelectItem>
                                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                                        <SelectItem value="Thursday">Thursday</SelectItem>
                                        <SelectItem value="Friday">Friday</SelectItem>
                                        <SelectItem value="Saturday">Saturday</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Time
                                    </Label>
                                    <Input
                                      placeholder="e.g., 7:00 PM"
                                      value={community.meetingTime}
                                      onChange={(e) => updateCommunity(index, 'meetingTime', e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">Contact Info</Label>
                                    <Input
                                      placeholder="Phone or email"
                                      value={community.contactInfo}
                                      onChange={(e) => updateCommunity(index, 'contactInfo', e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      Max Capacity
                                    </Label>
                                    <Input
                                      type="number"
                                      min="5"
                                      max="50"
                                      value={community.maxCapacity}
                                      onChange={(e) => updateCommunity(index, 'maxCapacity', parseInt(e.target.value))}
                                      className="text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addCommunity}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Community
                          </Button>
                        </div>

                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            <strong>Verification Required:</strong> Your leadership application and community details will be reviewed by our team. This typically takes 2-3 business days. You'll receive an email once approved.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-secondary/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              By creating an account, you agree to connect with authentic Christian communities 
              following New Testament principles of fellowship, teaching, and breaking bread together.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;