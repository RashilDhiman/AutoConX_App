import { isTodayOrFuture, parseIsoDate, toIsoDate } from './date';

describe('dates', () => {
  const today = new Date(2026, 9, 10);

  it('formats a local calendar date without shifting the day', () => {
    expect(toIsoDate(new Date(2026, 9, 15, 23, 30))).toBe('2026-10-15');
  });

  it('rejects an impossible calendar date', () => {
    expect(parseIsoDate('2026-02-31')).toBeNull();
    expect(parseIsoDate('15-10-2026')).toBeNull();
  });

  it('accepts today and rejects yesterday', () => {
    expect(isTodayOrFuture('2026-10-10', today)).toBe(true);
    expect(isTodayOrFuture('2026-10-09', today)).toBe(false);
  });
});
