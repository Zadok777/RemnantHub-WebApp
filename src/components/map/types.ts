export interface MapCommunity {
  id: string;
  name: string;
  description: string | null;
  meeting_day: string;
  meeting_time: string;
  trust_level: string;
  member_count: number;
  location_city: string;
  location_state: string;
  location_lat: number;
  location_lng: number;
  tags: string[];
  leader_id: string;
  contact_info: any;
  created_at: string;
  updated_at: string;
}