let mockLatencyMs = 700;

export function setMockLatency(ms: number) {
  mockLatencyMs = ms;
}

export function delay() {
  if (mockLatencyMs <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>(resolve => {
    setTimeout(resolve, mockLatencyMs);
  });
}
