import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Users, Clock, Star, Filter, Search as SearchIcon, Navigation } from 'lucide-react';
import { mockCommunities, Community } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { useLocation, calculateDistance } from '@/hooks/useLocation';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrustLevels, setSelectedTrustLevels] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const { location, getCurrentLocation, loading: locationLoading } = useLocation();

  // Filter and search logic
  const filteredCommunities = useMemo(() => {
    return mockCommunities.filter(community => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Trust level filter
      const matchesTrustLevel = selectedTrustLevels.length === 0 || 
        selectedTrustLevels.includes(community.trustLevel);

      // Meeting day filter
      const matchesDay = selectedDays.length === 0 || 
        selectedDays.includes(community.meetingDay);

      // Features filter
      const matchesFeatures = selectedFeatures.length === 0 || 
        selectedFeatures.some(feature => community.tags.includes(feature));

      return matchesSearch && matchesTrustLevel && matchesDay && matchesFeatures;
    });
  }, [searchTerm, selectedTrustLevels, selectedDays, selectedFeatures]);

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Established': return 'bg-green-100 text-green-800';
      case 'Verified': return 'bg-primary/10 text-primary';
      case 'Endorsed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrustLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setSelectedTrustLevels(prev => [...prev, level]);
    } else {
      setSelectedTrustLevels(prev => prev.filter(l => l !== level));
    }
  };

  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedDays(prev => [...prev, day]);
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures(prev => [...prev, feature]);
    } else {
      setSelectedFeatures(prev => prev.filter(f => f !== feature));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic house church communities in your area where believers gather for fellowship, teaching, and breaking bread together.
          </p>
        </div>

        {/* Search Bar */}
        <div className="community-card max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by location, community name, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button 
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="h-12 px-8"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {locationLoading ? 'Finding...' : 'Find Near Me'}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="community-card sticky top-20">
              <h3 className="text-xl font-semibold mb-6">Filter Communities</h3>
              
                  <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Trust Level</h4>
                  <div className="space-y-2">
                    {['New', 'Established', 'Verified', 'Endorsed'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`trust-${level}`}
                          checked={selectedTrustLevels.includes(level)}
                          onCheckedChange={(checked) => handleTrustLevelChange(level, checked as boolean)}
                        />
                        <label htmlFor={`trust-${level}`} className="cursor-pointer">
                          <Badge className={getTrustLevelColor(level)}>{level}</Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Meeting Day</h4>
                  <div className="space-y-2">
                    {['Sunday', 'Wednesday', 'Saturday'].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`}
                          checked={selectedDays.includes(day)}
                          onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                        />
                        <label htmlFor={`day-${day}`} className="text-sm cursor-pointer">{day}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Community Features</h4>
                  <div className="space-y-2">
                    {['Family-friendly', 'Bible Study', 'Contemporary Worship', 'Traditional Worship'].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature}`}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                        />
                        <label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">{feature}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Cards */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Found {filteredCommunities.length} communities
                {location && ' near you'}
              </p>
              {(selectedTrustLevels.length > 0 || selectedDays.length > 0 || selectedFeatures.length > 0 || searchTerm) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTrustLevels([]);
                    setSelectedDays([]);
                    setSelectedFeatures([]);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {filteredCommunities.map((community) => (
                <Card key={community.id} className="community-card hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{community.name}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {community.location.city}, {community.location.state}
                        </CardDescription>
                      </div>
                      <Badge className={getTrustLevelColor(community.trustLevel)}>
                        {community.trustLevel}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {community.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {community.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {community.members} members
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {community.meetingDay}s at {community.meetingTime}
                      </div>
                      {location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {calculateDistance(
                            location.latitude,
                            location.longitude,
                            community.location.lat,
                            community.location.lng
                          )} mi
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1" asChild>
                        <Link to={`/community/${community.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Contact Leader
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Communities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;