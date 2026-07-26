const ROSE_EMOJI = '🌹';
const MAX_RATING = 6;

export function normalizeRoseRating(rating: number): number {
  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(MAX_RATING, Math.max(0, Math.trunc(rating)));
}

export function formatRoseRating(rating: number): string {
  const normalizedRating = normalizeRoseRating(rating);
  return normalizedRating === 0 ? '0' : ROSE_EMOJI.repeat(normalizedRating);
}

export function getRoseRatingLabel(rating: number): string {
  const normalizedRating = normalizeRoseRating(rating);
  return `${normalizedRating} من ${MAX_RATING}`;
}
