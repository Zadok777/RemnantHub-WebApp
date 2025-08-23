export interface Community {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  leader: {
    name: string;
    bio: string;
    photo: string;
  };
  members: number;
  meetingTime: string;
  meetingDay: string;
  trustLevel: 'New' | 'Established' | 'Verified' | 'Endorsed';
  tags: string[];
  photos: string[];
  founded: string;
  denomination: string;
  ageGroups: string[];
  ministries: string[];
}

export const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Grace Family Fellowship',
    description: 'A warm house church community focused on authentic relationships, biblical teaching, and breaking bread together. We gather weekly in our home for worship, prayer, and fellowship, following the Acts 2 model of early church community.',
    location: {
      address: '1234 Oak Street',
      city: 'Austin',
      state: 'TX',
      lat: 30.2672,
      lng: -97.7431
    },
    leader: {
      name: 'Pastor Mike & Sarah Johnson',
      bio: 'Mike and Sarah have been leading house churches for over 15 years. They are passionate about creating intimate spaces for spiritual growth and authentic Christian fellowship.',
      photo: '/api/placeholder/150/150'
    },
    members: 18,
    meetingTime: '10:00 AM',
    meetingDay: 'Sunday',
    trustLevel: 'Verified',
    tags: ['Family-friendly', 'Bible Study', 'Prayer', 'Fellowship Meals'],
    photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    founded: '2019',
    denomination: 'Non-denominational',
    ageGroups: ['Adults', 'Children', 'Teenagers'],
    ministries: ['Youth Ministry', 'Marriage Counseling', 'Community Outreach']
  },
  {
    id: '2',
    name: 'Cornerstone Home Church',
    description: 'Small but mighty community of believers dedicated to studying God\'s Word and supporting one another through life\'s journey. We emphasize expository teaching and authentic discipleship.',
    location: {
      address: '5678 Maple Avenue',
      city: 'Austin',
      state: 'TX',
      lat: 30.3078,
      lng: -97.7559
    },
    leader: {
      name: 'David & Rebecca Chen',
      bio: 'David is a seminary graduate with a heart for discipleship. Rebecca leads our children\'s ministry and hospitality team. Together they create a welcoming environment for all.',
      photo: '/api/placeholder/150/150'
    },
    members: 12,
    meetingTime: '6:00 PM',
    meetingDay: 'Sunday',
    trustLevel: 'Established',
    tags: ['Bible Study', 'Discipleship', 'Worship', 'Children\'s Ministry'],
    photos: ['/api/placeholder/400/300'],
    founded: '2021',
    denomination: 'Reformed',
    ageGroups: ['Adults', 'Children'],
    ministries: ['Discipleship Groups', 'Children\'s Ministry']
  },
  {
    id: '3',
    name: 'Living Waters Fellowship',
    description: 'Young adult focused house church that meets for contemporary worship, relevant Bible teaching, and genuine community. We love sharing meals and doing life together.',
    location: {
      address: '9012 Pine Road',
      city: 'Austin',
      state: 'TX',
      lat: 30.2849,
      lng: -97.7341
    },
    leader: {
      name: 'Pastor Alex Martinez',
      bio: 'Alex is a young pastor with a passion for reaching his generation with the Gospel. He combines biblical depth with cultural relevance in his teaching.',
      photo: '/api/placeholder/150/150'
    },
    members: 25,
    meetingTime: '7:00 PM',
    meetingDay: 'Wednesday',
    trustLevel: 'New',
    tags: ['Young Adults', 'Contemporary Worship', 'Social Justice', 'Community Service'],
    photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    founded: '2023',
    denomination: 'Pentecostal',
    ageGroups: ['Young Adults'],
    ministries: ['College Ministry', 'Community Service', 'Worship Team']
  },
  {
    id: '4',
    name: 'Faithful Remnant House Church',
    description: 'Traditional house church emphasizing liturgical worship, Scripture reading, and the sacraments. We follow historic Christian practices in an intimate home setting.',
    location: {
      address: '3456 Cedar Lane',
      city: 'Austin',
      state: 'TX',
      lat: 30.2500,
      lng: -97.7500
    },
    leader: {
      name: 'Father Thomas & Mary O\'Connor',
      bio: 'Thomas brings 20 years of pastoral experience to our community. Mary leads our women\'s ministry and coordinates our meal sharing and care ministry.',
      photo: '/api/placeholder/150/150'
    },
    members: 15,
    meetingTime: '9:00 AM',
    meetingDay: 'Sunday',
    trustLevel: 'Endorsed',
    tags: ['Traditional Worship', 'Liturgical', 'Sacraments', 'Historical Christianity'],
    photos: ['/api/placeholder/400/300'],
    founded: '2017',
    denomination: 'Anglican',
    ageGroups: ['Adults', 'Seniors'],
    ministries: ['Women\'s Ministry', 'Care Ministry', 'Biblical Studies']
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  location: {
    city: string;
    state: string;
  };
  bio: string;
  spiritualBackground: string;
  lookingFor: string[];
  joinedCommunities: string[];
  preferences: {
    maxDistance: number;
    preferredDays: string[];
    ageGroups: string[];
    ministries: string[];
  };
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jennifer Smith',
    email: 'jennifer@example.com',
    location: {
      city: 'Austin',
      state: 'TX'
    },
    bio: 'Recently moved to Austin and looking for a welcoming church community where I can grow in my faith and build meaningful relationships.',
    spiritualBackground: 'Grew up in Methodist church, exploring different denominations',
    lookingFor: ['Bible Study', 'Fellowship', 'Service Opportunities'],
    joinedCommunities: [],
    preferences: {
      maxDistance: 15,
      preferredDays: ['Sunday', 'Wednesday'],
      ageGroups: ['Adults'],
      ministries: ['Bible Study', 'Women\'s Ministry']
    }
  }
];

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  communityId?: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export const mockMessages: Message[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    communityId: '1',
    subject: 'Interest in joining Grace Family Fellowship',
    content: 'Hi Pastor Mike, I\'m new to the Austin area and would love to learn more about your house church. Your emphasis on authentic relationships really resonates with me.',
    timestamp: new Date('2024-01-15T10:30:00'),
    read: false
  }
];