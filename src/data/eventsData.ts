import { GameEvent, RegistrationData } from '../types';

export const upcomingEvents: GameEvent[] = [
  {
    id: 'ev-1',
    title: 'THE FOOTBALL BAITHAK',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
    date: 'JULY 07',
    time: '19:00 IST ONWARDS',
    prizePool: '₹5,000 FIFA Halftime Quiz & Predictions',
    entryFee: '₹2,000 ALL-INCLUSIVE COVER',
    spotsLeft: 45,
    category: 'upcoming',
    ctaLink: 'https://docs.google.com/forms/d/e/1FAIpQLSe6oxbzbhWRDpm9xkbBnaogIcUQCCoTvvxail5HJfTQdcimAw/viewform',
    description: 'Get ready for the ultimate football screening watch party of the year: Egypt/Australia vs Argentina! Enjoy live commentary on a massive HD screen with top-tier sound, paired with an all-inclusive culinary pass. Participate in the ₹5,000 PS5 FIFA Halftime Showdown, soccer trivia quizzes, and match predictions. Come for the match, stay for the high-performance builder community!',
    venue: 'BIG PITCHER BREWERY, SECTOR 29, GURUGRAM',
    inclusions: [
      'UNLIMITED craft beer, curated cocktails & mocktails',
      'UNLIMITED premium veg & non-veg starters',
      'Massive HD screen viewing with immersive stadium-grade audio',
      'Cozy seating arrangement in a premium lounge space'
    ],
    games: [
      '₹5,000 PS5 FIFA Championship (Halftime & Post-Match)',
      'Football trivia quiz & exclusive giveaways'
    ],
    predictions: [
      'Match score & goal scorer predictions (Win limited edition BP Merch!)',
      'Builders icebreaker & high-performance networking sessions',
      'Professional reels & newsletter feature opportunities'
    ],
    mapUrl: 'https://maps.google.com/?q=Big+Pitcher+Sector+29+Gurugram'
  }
];

export const pastEvents: GameEvent[] = [
  {
    id: 'ev-p1',
    title: 'PREMIER LEAGUE LIVE watch party',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    date: 'JUN 14',
    time: '18:00 IST',
    prizePool: '₹2,500 BP Gift Voucher',
    participants: '120+ Builders',
    category: 'past',
    description: 'A completed high-vibe live watch party at Sector 29 Gurugram. Fully packed venue with incredible crowd atmosphere.',
    venue: 'Big Pitcher Brewery, Sector 29, Gurugram'
  }
];

export interface RankingRow {
  rank: number;
  id: string;
  name: string;
  faction: string;
  competitions: number;
  winRate: string;
  points: number;
  status: 'active' | 'retired';
}

export const globalRankings: RankingRow[] = [
  { rank: 1, id: 'BP-9902', name: 'tarun_n', faction: 'FIFA PROS', competitions: 42, winRate: '88.2%', points: 15420, status: 'active' },
  { rank: 2, id: 'BP-4812', name: 'sam_g', faction: 'F1 SIMULATORS', competitions: 38, winRate: '76.4%', points: 12150, status: 'active' },
  { rank: 3, id: 'BP-0245', name: 'lucas_fifa', faction: 'FIFA PROS', competitions: 55, winRate: '71.1%', points: 11980, status: 'active' },
  { rank: 4, id: 'BP-1090', name: 'cozy_gamer_mia', faction: 'BOARD GAME LEAGUE', competitions: 29, winRate: '82.0%', points: 10400, status: 'active' },
  { rank: 5, id: 'BP-8819', name: 'marcus_k', faction: 'FIFA PROS', competitions: 31, winRate: '68.5%', points: 9210, status: 'active' },
  { rank: 6, id: 'BP-5510', name: 'speedy_f1', faction: 'F1 SIMULATORS', competitions: 22, winRate: '90.9%', points: 8900, status: 'active' },
  { rank: 7, id: 'BP-3304', name: 'retro_lucy', faction: 'BOARD GAME LEAGUE', competitions: 40, winRate: '62.5%', points: 8120, status: 'active' }
];

// Live dynamic persistence helper methods for Admin Panels & Synchronization
export function getUpcomingEvents(): GameEvent[] {
  const saved = localStorage.getItem('bp_custom_events');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as GameEvent[];
      const customUpcoming = parsed.filter(e => e.category === 'upcoming');
      return [...customUpcoming, ...upcomingEvents];
    } catch (e) {
      // Ignore
    }
  }
  return upcomingEvents;
}

export function getPastEvents(): GameEvent[] {
  const saved = localStorage.getItem('bp_custom_events');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as GameEvent[];
      const customPast = parsed.filter(e => e.category === 'past');
      return [...customPast, ...pastEvents];
    } catch (e) {
      // Ignore
    }
  }
  return pastEvents;
}

export function addCustomEvent(event: GameEvent) {
  const saved = localStorage.getItem('bp_custom_events');
  let current: GameEvent[] = [];
  if (saved) {
    try {
      current = JSON.parse(saved) as GameEvent[];
    } catch (e) {}
  }
  current.unshift(event);
  localStorage.setItem('bp_custom_events', JSON.stringify(current));
  window.dispatchEvent(new Event('bp_events_updated'));
}

export function deleteCustomEvent(id: string) {
  const saved = localStorage.getItem('bp_custom_events');
  if (saved) {
    try {
      let current = JSON.parse(saved) as GameEvent[];
      current = current.filter(e => e.id !== id);
      localStorage.setItem('bp_custom_events', JSON.stringify(current));
      window.dispatchEvent(new Event('bp_events_updated'));
    } catch (e) {}
  }
}

export function getRegistrations(): RegistrationData[] {
  const saved = localStorage.getItem('bp_registrations');
  if (saved) {
    try {
      return JSON.parse(saved) as RegistrationData[];
    } catch (e) {}
  }
  return [];
}

export function addRegistration(reg: Omit<RegistrationData, 'id' | 'timestamp'>) {
  const saved = localStorage.getItem('bp_registrations');
  let current: RegistrationData[] = [];
  if (saved) {
    try {
      current = JSON.parse(saved) as RegistrationData[];
    } catch (e) {}
  }
  const newReg: RegistrationData = {
    ...reg,
    id: 'reg-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString()
  };
  current.unshift(newReg);
  localStorage.setItem('bp_registrations', JSON.stringify(current));
  window.dispatchEvent(new Event('bp_registrations_updated'));
}

