import type { CodolioSignals } from './types';

/**
 * Codolio public profile API client.
 * Endpoint: https://api.codolio.com/profile?userKey=<username>
 * No authentication required for public profiles.
 */

export interface CodolioApiError {
  type: 'notfound' | 'network' | 'invalid';
  message: string;
}

interface PlatformProfile {
  platform: string;
  userStats: {
    currentRating: number | null;
    maxRating: number | null;
    handle: string | null;
    titlePhoto: string | null;
    languageList: string[] | null;
    level: number | null;
  } | null;
  badgeStats: {
    badgeList: { name: string }[] | null;
  } | null;
  totalQuestionStats: {
    totalQuestionCounts: number;
    easyQuestionCounts: number | null;
    mediumQuestionCounts: number | null;
    hardQuestionCounts: number | null;
    basicQuestionCounts: number | null;
  } | null;
  contestActivityStats: {
    contestActivityList: { contestName: string; rating: number; rank: number }[] | null;
  } | null;
  dailyActivityStatsResponse: {
    maxStreak: number | null;
    totalActiveDays: number | null;
    submissionCalendar: Record<string, number> | null;
  } | null;
}

interface CodolioApiResponse {
  status: {
    success: boolean;
    code: number;
    message: string;
  };
  data: {
    id: number;
    imageUrl: string | null;
    firstName: string;
    secondName: string;
    profileName: string;
    profileViews: number;
    userDetails: {
      githubProfile: string | null;
      userPersonalDetails: {
        bio: string | null;
        country: string | null;
        college: string | null;
      } | null;
    } | null;
    platformProfiles: {
      platformProfiles: PlatformProfile[];
    } | null;
  } | null;
}

function computeCurrentStreak(calendar: Record<string, number> | null): number {
  if (!calendar) return 0;

  // Get today's timestamp at midnight UTC
  const now = new Date();
  const todayMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayTs = Math.floor(todayMidnight.getTime() / 1000);

  // Sort all timestamps descending
  const timestamps = Object.keys(calendar)
    .map(Number)
    .sort((a, b) => b - a);

  if (timestamps.length === 0) return 0;

  let streak = 0;
  let checkDate = todayTs;

  // Check if submitted today or yesterday
  const mostRecent = timestamps[0];
  if (mostRecent < checkDate - 86400) {
    return 0; // Most recent is older than yesterday
  }

  // If didn't submit today, start from yesterday
  if (mostRecent < checkDate) {
    checkDate -= 86400;
  }

  const tsSet = new Set(timestamps);
  while (tsSet.has(checkDate)) {
    streak++;
    checkDate -= 86400;
  }

  return streak;
}

export async function fetchCodolioProfile(username: string): Promise<CodolioSignals> {
  const cleanUsername = username.trim().replace(/^@/, '');

  if (!cleanUsername || cleanUsername.length > 50) {
    throw { type: 'invalid', message: 'Invalid username' } as CodolioApiError;
  }

  let response: Response;
  try {
    response = await fetch(`https://api.codolio.com/profile?userKey=${encodeURIComponent(cleanUsername)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch {
    throw { type: 'network', message: 'Network error. Please check your connection.' } as CodolioApiError;
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw { type: 'notfound', message: `User "${cleanUsername}" not found on Codolio.` } as CodolioApiError;
    }
    throw { type: 'network', message: `Codolio API returned ${response.status}` } as CodolioApiError;
  }

  const json: CodolioApiResponse = await response.json();

  if (!json.status?.success || !json.data) {
    throw { type: 'notfound', message: `User "${cleanUsername}" not found on Codolio.` } as CodolioApiError;
  }

  const d = json.data;
  const platforms = d.platformProfiles?.platformProfiles || [];

  // Aggregate stats across ALL platforms
  let totalSolved = 0, easySolved = 0, mediumSolved = 0, hardSolved = 0;
  let maxContestRating = 0, totalContestsAttended = 0;
  let maxStreak = 0, totalBadges = 0;
  const allLanguages = new Set<string>();
  let activePlatforms = 0;
  let bestAvatarUrl = d.imageUrl || '';

  // Merge submission calendars for current streak calculation
  const mergedCalendar: Record<string, number> = {};

  for (const p of platforms) {
    const qs = p.totalQuestionStats;
    if (qs && qs.totalQuestionCounts > 0) {
      activePlatforms++;
      totalSolved += qs.totalQuestionCounts || 0;
      easySolved += (qs.easyQuestionCounts || 0) + (qs.basicQuestionCounts || 0);
      mediumSolved += qs.mediumQuestionCounts || 0;
      hardSolved += qs.hardQuestionCounts || 0;
    }

    // Contest rating — take the highest across platforms
    const contests = p.contestActivityStats?.contestActivityList || [];
    if (contests.length > 0) {
      totalContestsAttended += contests.length;
      for (const c of contests) {
        if (c.rating > maxContestRating) maxContestRating = c.rating;
      }
    }

    // Also check userStats for rating
    if (p.userStats?.maxRating && p.userStats.maxRating > maxContestRating) {
      maxContestRating = p.userStats.maxRating;
    }

    // Streaks
    if (p.dailyActivityStatsResponse?.maxStreak) {
      maxStreak = Math.max(maxStreak, p.dailyActivityStatsResponse.maxStreak);
    }

    // Merge submission calendars
    if (p.dailyActivityStatsResponse?.submissionCalendar) {
      for (const [ts, count] of Object.entries(p.dailyActivityStatsResponse.submissionCalendar)) {
        mergedCalendar[ts] = (mergedCalendar[ts] || 0) + count;
      }
    }

    // Languages
    if (p.userStats?.languageList) {
      for (const lang of p.userStats.languageList) {
        allLanguages.add(lang.toLowerCase());
      }
    }

    // Badges
    if (p.badgeStats?.badgeList) {
      totalBadges += p.badgeStats.badgeList.length;
    }

    // Best avatar — prefer LeetCode avatar, then the platform one
    if (p.platform === 'leetcode' && p.userStats?.titlePhoto) {
      bestAvatarUrl = p.userStats.titlePhoto;
    }
  }

  const currentStreak = computeCurrentStreak(mergedCalendar);

  return {
    username: d.profileName || cleanUsername,
    name: [d.firstName, d.secondName].filter(Boolean).join(' ') || d.profileName || cleanUsername,
    avatarUrl: bestAvatarUrl,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    platforms: Math.max(1, activePlatforms),
    contestRating: maxContestRating,
    contestsAttended: totalContestsAttended,
    currentStreak,
    maxStreak,
    languages: Math.max(1, allLanguages.size),
    contributions: totalBadges, // Using badges as a proxy for contributions
    reputation: d.profileViews || 0, // Using profile views as reputation proxy
  };
}
