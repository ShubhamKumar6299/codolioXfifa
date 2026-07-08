export type StatKey = 'pac' | 'sho' | 'pas' | 'dri' | 'def' | 'phy';
export type Stats = Record<StatKey, number>;

export type Finish = 'bronze' | 'silver' | 'gold' | 'totw' | 'toty' | 'icon';
export type Position = 'ST' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'CB';

export interface CodolioSignals {
  username: string;
  name: string;
  avatarUrl: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  platforms: number;
  contestRating: number;
  contestsAttended: number;
  currentStreak: number;
  maxStreak: number;
  languages: number;
  contributions: number;
  reputation: number;
}

export interface Card {
  signals: CodolioSignals;
  stats: Stats;
  overall: number;
  position: Position;
  finish: Finish;
  name: string;
  username: string;
  avatarUrl: string;
}

export const STAT_KEYS: StatKey[] = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];

export const STAT_LABELS: Record<StatKey, string> = {
  pac: 'PAC',
  sho: 'SHO',
  pas: 'PAS',
  dri: 'DRI',
  def: 'DEF',
  phy: 'PHY',
};

export const STAT_DESCRIPTIONS: Record<StatKey, string> = {
  pac: 'Consistency & momentum — driven by streak activity',
  sho: 'Problem volume & difficulty mastery',
  pas: 'Competitive performance — contests & ratings',
  dri: 'Versatility — languages & platform diversity',
  def: 'Community impact — contributions & reputation',
  phy: 'Endurance & completeness across all difficulties',
};
