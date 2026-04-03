import { format } from "date-fns";
import { getOrSetCache } from "./cache";
import { getEnv } from "./env";
import type { LanguageSlice, TrendPoint, WakaTimeStats } from "./types";

const WAKATIME_BASE_URL = "https://wakatime.com/api/v1";
const WAKATIME_CACHE_TTL_MS = 4 * 60 * 60 * 1000;

interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
}

interface WakaTimeDay {
  date: string;
  total_seconds: number;
}

interface WakaTimeResponse {
  data: {
    total_seconds: number;
    languages?: WakaTimeLanguage[];
    days?: WakaTimeDay[];
  };
}

function authHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

async function fetchWakaTime(path: string, apiKey: string): Promise<WakaTimeResponse> {
  const response = await fetch(`${WAKATIME_BASE_URL}${path}`, {
    headers: {
      Authorization: authHeader(apiKey),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WakaTime request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as WakaTimeResponse;
}

function toHours(seconds: number): number {
  return Number((seconds / 3600).toFixed(1));
}

function mapLanguages(languages: WakaTimeLanguage[] | undefined): LanguageSlice[] {
  if (!languages || languages.length === 0) {
    return [];
  }

  return languages
    .slice(0, 7)
    .map((item, index) => ({
      name: item.name,
      value: Number(item.percent.toFixed(1)),
      color: ["#58A6FF", "#F7DF1E", "#FF6B6B", "#7EE787", "#C297FF", "#F0883E", "#79C0FF"][index] ?? "#8B949E",
    }));
}

function mapDailyHours(days: WakaTimeDay[] | undefined): TrendPoint[] {
  if (!days || days.length === 0) {
    return [];
  }

  return days.slice(-7).map((day) => ({
    label: format(new Date(day.date), "EEE"),
    value: toHours(day.total_seconds),
  }));
}

function computeStreak(days: WakaTimeDay[] | undefined): number {
  if (!days || days.length === 0) {
    return 0;
  }

  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].total_seconds <= 0) {
      break;
    }
    streak += 1;
  }

  return streak;
}

export async function getWakaTimeStats(): Promise<WakaTimeStats> {
  const env = getEnv();

  if (!env.WAKATIME_API_KEY) {
    return {
      active: false,
      totalHoursWeek: 0,
      totalHoursMonth: 0,
      codingStreak: 0,
      mostProductiveDay: "N/A",
      languages: [],
      dailyHoursLastWeek: [],
      outdated: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  const { data, outdated, lastUpdated } = await getOrSetCache(
    "wakatime:current",
    WAKATIME_CACHE_TTL_MS,
    async () => {
      const [week, month] = await Promise.all([
        fetchWakaTime("/users/current/stats/last_7_days", env.WAKATIME_API_KEY ?? ""),
        fetchWakaTime("/users/current/stats/last_30_days", env.WAKATIME_API_KEY ?? ""),
      ]);

      const productiveDay = (week.data.days ?? []).reduce(
        (current, day) => (day.total_seconds > current.total_seconds ? day : current),
        { date: new Date().toISOString(), total_seconds: 0 },
      );

      return {
        active: true,
        totalHoursWeek: toHours(week.data.total_seconds),
        totalHoursMonth: toHours(month.data.total_seconds),
        codingStreak: computeStreak(week.data.days),
        mostProductiveDay: productiveDay.total_seconds > 0 ? format(new Date(productiveDay.date), "EEEE") : "N/A",
        languages: mapLanguages(month.data.languages),
        dailyHoursLastWeek: mapDailyHours(week.data.days),
        outdated: false,
        lastUpdated: new Date().toISOString(),
      } satisfies WakaTimeStats;
    },
  );

  return {
    ...data,
    outdated,
    lastUpdated,
  };
}
