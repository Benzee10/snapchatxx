
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  contactInfo: {
    whatsapp?: string;
    telegram?: string;
  };
  location: string;
}

export enum SubscriptionStatus {
  Free = 'Free',
  Subscribed = 'Subscribed',
}
