export interface GameEvent {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  prizePool?: string;
  entryFee?: string;
  tier?: string;
  spotsLeft?: number;
  participants?: string;
  duration?: string;
  category: 'upcoming' | 'past';
  ctaLink?: string; // Custom external RSVP link (e.g., Luma, Microsoft Forms)
  description?: string;
  venue?: string;
  inclusions?: string[];
  games?: string[];
  predictions?: string[];
  mapUrl?: string;
}

export interface RegistrationData {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  timestamp: string;
  status: 'OTP_VERIFIED_REDIRECTED' | 'OTP_PENDING';
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  type: 'partnership' | 'events' | 'support' | 'feedback';
}

export interface UserSession {
  isLoggedIn: boolean;
  personnelId: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

export type ViewType = 'home' | 'events' | 'newsletter' | 'about' | 'contact' | 'login';

