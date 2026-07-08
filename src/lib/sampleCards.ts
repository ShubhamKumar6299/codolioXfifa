import type { CodolioSignals } from './types';
import { buildCard } from './scoring';
import type { Card } from './types';

const SAMPLE_SIGNALS: CodolioSignals[] = [
  {
    username: 'CodeMaster99',
    name: 'Arjun Patel',
    avatarUrl: '',
    totalSolved: 1820,
    easySolved: 480,
    mediumSolved: 920,
    hardSolved: 420,
    platforms: 4,
    contestRating: 2150,
    contestsAttended: 85,
    currentStreak: 180,
    maxStreak: 365,
    languages: 8,
    contributions: 1200,
    reputation: 3500,
  },
  {
    username: 'AlgoQueen',
    name: 'Priya Sharma',
    avatarUrl: '',
    totalSolved: 650,
    easySolved: 200,
    mediumSolved: 350,
    hardSolved: 100,
    platforms: 3,
    contestRating: 1650,
    contestsAttended: 35,
    currentStreak: 45,
    maxStreak: 90,
    languages: 5,
    contributions: 450,
    reputation: 800,
  },
  {
    username: 'ByteNinja',
    name: 'Rahul Dev',
    avatarUrl: '',
    totalSolved: 280,
    easySolved: 120,
    mediumSolved: 130,
    hardSolved: 30,
    platforms: 2,
    contestRating: 1200,
    contestsAttended: 12,
    currentStreak: 14,
    maxStreak: 30,
    languages: 3,
    contributions: 80,
    reputation: 150,
  },
];

export function getSampleCards(): Card[] {
  return SAMPLE_SIGNALS.map(buildCard);
}
