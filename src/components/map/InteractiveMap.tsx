import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Settings } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { Community } from '@/data/mockData';

interface InteractiveMapProps {
  communities?: Community[];
  onCommunitySelect?: (community: Community) => void;
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  communities = [], 
  onCommunitySelect,
  height = "h-[600px]" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const { location, getCurrentLocation, loading: locationLoading } = useLocation();

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add markers for communities
    communities.forEach((community) => {
      const marker = new mapboxgl.Marker({
        color: '#E85A2B' // Primary color
      })
        .setLngLat([community.location.lng, community.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-lg">${community.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${community.location.city}, ${community.location.state}</p>
                <p class="text-xs text-gray-500 mb-2">${community.description}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">${community.trustLevel}</span>
                  <span class="text-xs">${community.members} members</span>
                </div>
              </div>
            `)
        )
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        setSelectedCommunity(community);
        onCommunitySelect?.(community);
      });
    });

    // Add user location marker if available
    if (location) {
      new mapboxgl.Marker({
        color: '#4285F4',
        scale: 1.2
      })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML('<div class="p-2"><strong>Your Location</strong></div>')
        )
        .addTo(map.current!);

      // Center map on user location
      map.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 10,
        duration: 2000
      });
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, communities, location, onCommunitySelect]);

  if (!mapboxToken) {
    return (
      <Card className={`${height} flex items-center justify-center`}>
        <CardContent className="text-center max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 mr-2" />
              Interactive Map Setup
            </CardTitle>
          </CardHeader>
          <p className="text-muted-foreground mb-4">
            To use the interactive map, please enter your Mapbox public token. 
            You can get one for free at{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-3">
            <Input
              placeholder="pk.eyJ1IjoiY..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-sm"
            />
            <Button 
              onClick={() => setMapboxToken(mapboxToken)}
              disabled={!mapboxToken.startsWith('pk.')}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Initialize Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className={`w-full ${height} rounded-lg shadow-lg border border-border`} />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={getCurrentLocation}
          disabled={locationLoading}
          size="sm"
          className="shadow-lg"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {locationLoading ? 'Finding...' : 'Find Me'}
        </Button>
      </div>

      {/* Selected Community Info */}
      {selectedCommunity && (
        <Card className="absolute bottom-4 left-4 right-4 z-10 max-w-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{selectedCommunity.name}</CardTitle>
              <Badge className="bg-primary/10 text-primary">
                {selectedCommunity.trustLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-2">
              {selectedCommunity.location.city}, {selectedCommunity.location.state}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {selectedCommunity.description.substring(0, 100)}...
            </p>
            <div className="flex justify-between items-center text-xs">
              <span>{selectedCommunity.members} members</span>
              <span>{selectedCommunity.meetingDay}s</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;