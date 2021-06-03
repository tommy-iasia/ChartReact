export class Stopwatch {
  constructor() {
    this.startTime = new Date();
  }

  elapsed() {
    const now = new Date();
    return now.getTime() - this.startTime.getTime();
  }

  async waitUntil(targetElapsed) {
    const elapsed = this.elapsed();
    const wait = targetElapsed - elapsed;

    await new Promise((resolve) => {
      setTimeout(resolve, wait);
    });
  }
}
