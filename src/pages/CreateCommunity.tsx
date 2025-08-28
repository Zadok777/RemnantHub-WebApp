import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Church, MapPin, Calendar, Users, Save, Loader2 } from 'lucide-react';

const CreateCommunity = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_city: '',
    location_state: '',
    meeting_day: '',
    meeting_time: '',
    contact_email: '',
    denomination: '',
    capacity: '',
    additional_info: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a community.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const communityData = {
        name: formData.name,
        description: formData.description,
        location_city: formData.location_city,
        location_state: formData.location_state,
        location_lat: 0, // Default coordinates - would be improved with geocoding
        location_lng: 0,
        meeting_day: formData.meeting_day,
        meeting_time: formData.meeting_time,
        max_capacity: formData.capacity ? parseInt(formData.capacity) : null,
        leader_id: user.id,
        trust_level: 'New', // Default trust level for new communities
        contact_info: {
          email: formData.contact_email,
          denomination: formData.denomination,
          additional_info: formData.additional_info
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('communities')
        .insert(communityData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Community created successfully!",
        description: "Your community has been created and is pending verification.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating community:', error);
      toast({
        title: "Error creating community",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container bg-community-gathering faded-overlay">
      <div className="content-container section-spacing">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Create New Community</h1>
          <p className="text-muted-foreground">Share your house church or fellowship with seekers in your area</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="community-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Church className="w-5 h-5" />
                <span>Community Details</span>
              </CardTitle>
              <CardDescription>
                Provide information about your community to help others find authentic Christian fellowship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div>
                    <Label htmlFor="name">Community Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Grace Family Fellowship"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your community, its focus, and what makes it unique..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="denomination">Denomination/Tradition</Label>
                    <Input
                      id="denomination"
                      value={formData.denomination}
                      onChange={(e) => handleInputChange('denomination', e.target.value)}
                      placeholder="e.g., Non-denominational, Baptist, Methodist, etc."
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location_city">City *</Label>
                      <Input
                        id="location_city"
                        value={formData.location_city}
                        onChange={(e) => handleInputChange('location_city', e.target.value)}
                        placeholder="Your city"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location_state">State *</Label>
                      <Select
                        value={formData.location_state}
                        onValueChange={(value) => handleInputChange('location_state', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="AR">Arkansas</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CT">Connecticut</SelectItem>
                          <SelectItem value="DE">Delaware</SelectItem>
                          <SelectItem value="DC">District of Columbia</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="HI">Hawaii</SelectItem>
                          <SelectItem value="ID">Idaho</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="IN">Indiana</SelectItem>
                          <SelectItem value="IA">Iowa</SelectItem>
                          <SelectItem value="KS">Kansas</SelectItem>
                          <SelectItem value="KY">Kentucky</SelectItem>
                          <SelectItem value="LA">Louisiana</SelectItem>
                          <SelectItem value="ME">Maine</SelectItem>
                          <SelectItem value="MD">Maryland</SelectItem>
                          <SelectItem value="MA">Massachusetts</SelectItem>
                          <SelectItem value="MI">Michigan</SelectItem>
                          <SelectItem value="MN">Minnesota</SelectItem>
                          <SelectItem value="MS">Mississippi</SelectItem>
                          <SelectItem value="MO">Missouri</SelectItem>
                          <SelectItem value="MT">Montana</SelectItem>
                          <SelectItem value="NE">Nebraska</SelectItem>
                          <SelectItem value="NV">Nevada</SelectItem>
                          <SelectItem value="NH">New Hampshire</SelectItem>
                          <SelectItem value="NJ">New Jersey</SelectItem>
                          <SelectItem value="NM">New Mexico</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="ND">North Dakota</SelectItem>
                          <SelectItem value="OH">Ohio</SelectItem>
                          <SelectItem value="OK">Oklahoma</SelectItem>
                          <SelectItem value="OR">Oregon</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="RI">Rhode Island</SelectItem>
                          <SelectItem value="SC">South Carolina</SelectItem>
                          <SelectItem value="SD">South Dakota</SelectItem>
                          <SelectItem value="TN">Tennessee</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="UT">Utah</SelectItem>
                          <SelectItem value="VT">Vermont</SelectItem>
                          <SelectItem value="VA">Virginia</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="WV">West Virginia</SelectItem>
                          <SelectItem value="WI">Wisconsin</SelectItem>
                          <SelectItem value="WY">Wyoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Meeting Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Meeting Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meeting_day">Meeting Day *</Label>
                      <Select
                        value={formData.meeting_day}
                        onValueChange={(value) => handleInputChange('meeting_day', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
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
                      <Label htmlFor="meeting_time">Meeting Time *</Label>
                      <Input
                        id="meeting_time"
                        type="time"
                        value={formData.meeting_time}
                        onChange={(e) => handleInputChange('meeting_time', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Contact & Details</span>
                  </h3>
                  
                  <div>
                    <Label htmlFor="contact_email">Contact Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="contact@community.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity">Expected Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      placeholder="e.g., 15"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional_info">Additional Information</Label>
                    <Textarea
                      id="additional_info"
                      value={formData.additional_info}
                      onChange={(e) => handleInputChange('additional_info', e.target.value)}
                      placeholder="Any additional details about your community, special requirements, etc."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Community...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Community
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Your community will be reviewed and verified before appearing in search results
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;