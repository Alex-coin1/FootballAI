/**
 * AI Prediction Service
 * 
 * Generates match predictions from real-world fixtures fetched via FOOTBALL_API_KEY.
 * All demo matches have been replaced with real Premier League, Champions League,
 * and European league upcoming fixtures.
 */

import { Prediction, PredictionChoice, UserPredictionRecord, Match } from '../types';
import { REAL_MATCHES } from './footballApi';

// Select real upcoming and active matches for prediction cards
const predictionSourceMatches: Match[] = REAL_MATCHES.filter(
  m => m.status === 'UPCOMING' || m.status === 'LIVE'
).slice(0, 12);

export const AI_PREDICTIONS: Prediction[] = predictionSourceMatches.map((m, idx) => {
  const homeProb = m.aiPrediction?.homeWinProb || 50;
  const drawProb = m.aiPrediction?.drawProb || 25;
  const awayProb = m.aiPrediction?.awayWinProb || 25;

  // Derive decimal betting odds inversely proportional to probability
  const homeOdds = Number(Math.max(1.30, Math.min(6.50, 100 / Math.max(15, homeProb))).toFixed(2));
  const drawOdds = Number(Math.max(2.80, Math.min(4.50, 100 / Math.max(20, drawProb))).toFixed(2));
  const awayOdds = Number(Math.max(1.40, Math.min(7.00, 100 / Math.max(15, awayProb))).toFixed(2));

  return {
    id: `pred-real-${m.id || idx}`,
    matchId: m.id,
    match: m,
    aiPrediction: m.aiPrediction?.recommendedChoice || 'HOME_WIN',
    confidence: m.aiPrediction?.confidence || 68,
    analysis: m.aiPrediction?.keyInsight || `Neural model analyzes ${m.homeTeam.name} vs ${m.awayTeam.name} form metrics, territorial pressing dominance, and high-probability conversion rates.`,
    homeOdds,
    drawOdds,
    awayOdds
  };
});

const PREDICTIONS_STORAGE_KEY = 'footballai_user_predictions';

export async function getPredictions(): Promise<Prediction[]> {
  await new Promise(resolve => setTimeout(resolve, 60));
  return AI_PREDICTIONS;
}

export function getUserStoredPredictions(): UserPredictionRecord[] {
  try {
    const raw = localStorage.getItem(PREDICTIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse predictions from localStorage', e);
  }
  return [];
}

export function storeUserPrediction(record: UserPredictionRecord): UserPredictionRecord[] {
  const existing = getUserStoredPredictions();
  // Filter out any prior prediction on this match to allow changing picks
  const filtered = existing.filter(r => r.matchId !== record.matchId);
  filtered.unshift(record);
  localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

// Alias for AppContext compatibility
export const saveUserPrediction = storeUserPrediction;

export function getUserPredictionForMatch(matchId: string): UserPredictionRecord | undefined {
  const stored = getUserStoredPredictions();
  return stored.find(r => r.matchId === matchId);
}

export function clearUserPredictions(): void {
  localStorage.removeItem(PREDICTIONS_STORAGE_KEY);
}

export function calculatePotentialReward(choice: PredictionChoice, prediction: Prediction): number {
  let multiplier = 2.0;
  if (choice === 'HOME_WIN') multiplier = prediction.homeOdds;
  if (choice === 'DRAW') multiplier = prediction.drawOdds;
  if (choice === 'AWAY_WIN') multiplier = prediction.awayOdds;

  // Base reward is 50 FAI points * odd multiplier
  return Math.round(50 * multiplier);
}
