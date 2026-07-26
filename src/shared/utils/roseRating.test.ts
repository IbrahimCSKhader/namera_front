import { describe, expect, it } from 'vitest';
import { formatRoseRating, getRoseRatingLabel, normalizeRoseRating } from './roseRating';

describe('roseRating', () => {
  it('formats ratings with real rose emoji', () => {
    expect(formatRoseRating(0)).toBe('0');
    expect(formatRoseRating(3)).toBe('🌹🌹🌹');
    expect(formatRoseRating(6)).toBe('🌹🌹🌹🌹🌹🌹');
  });

  it('keeps rating values inside the supported range', () => {
    expect(normalizeRoseRating(-2)).toBe(0);
    expect(normalizeRoseRating(4.8)).toBe(4);
    expect(normalizeRoseRating(12)).toBe(6);
  });

  it('returns an accessible rating label', () => {
    expect(getRoseRatingLabel(5)).toBe('5 من 6');
  });
});
