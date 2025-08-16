export function parseDuration(input) {
  // e.g. "1h30m", "45m", "10s", "2h"
  const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i;
  const match = input.match(regex);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const mins = parseInt(match[2] || '0', 10);
  const secs = parseInt(match[3] || '0', 10);
  const ms = (hours * 3600 + mins * 60 + secs) * 1000;
  return ms > 0 ? ms : null;
}
