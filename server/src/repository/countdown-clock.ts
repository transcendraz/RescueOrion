import { GameDuration } from "../metadata/types";

class CountdownClock {

  constructor(from: number) {
    this.countdownFrom = Math.floor(from);
    this.remainingTime = Math.floor(from);
  }

  private countdownFrom: number;
  private remainingTime: number;
  private interval: NodeJS.Timeout;
  private onTickSubscribers: (() => void)[] = [];
  private onTimeUpSubscribers: (() => void)[] = [];

  subscribeTick(callback: () => void) {
    this.onTickSubscribers.push(callback);
  }

  subscribeTimeUp(callback: () => void) {
    this.onTimeUpSubscribers.push(callback);
  }

  setCountdownTime(from: number) {
    this.countdownFrom = Math.floor(from);
    this.remainingTime = Math.floor(from);
    this.onTickSubscribers.forEach((callback) => callback());
  }

  start() {
    clearInterval(this.interval);
    this.interval = global.setInterval(() => {
      --this.remainingTime;
      this.onTickSubscribers.forEach((callback) => callback());
      if (this.remainingTime === 0) {
        this.stop();
        this.onTimeUpSubscribers.forEach((callback) => callback());
      }
    }, 1000);
  }

  stop() {
    clearTimeout(this.interval);
  }

  getSecondsRemaining() {
    return this.remainingTime;
  }

  // Difference between set count down and time remaining
  getSecondsElapsed() {
    return this.countdownFrom - this.remainingTime;
  }

  getGameDuration(): GameDuration {
    return {
      duration: this.getSecondsElapsed(),
      countdown: this.getSecondsRemaining(),
    }
  }
}

export default CountdownClock;