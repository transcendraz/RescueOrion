import { LobbyStatus, LobbyState, ABORT_MISSION } from "../metadata/types";
import repository, { Lobby } from "../repository";
import CountdownClock from '../repository/countdown-clock';
import {jest, describe, expect, it, beforeAll, beforeEach, afterEach } from '@jest/globals'
import { count } from "console";

describe('countdownclock', () => {
    it('basic advance time', () => {
      const countdownclock=new CountdownClock(75);
      expect(countdownclock.getSecondsRemaining()).toEqual(75);
      countdownclock.setCountdownTime(100);
      expect(countdownclock.getSecondsRemaining()).toEqual(100);
      jest.useFakeTimers();
      countdownclock.start();
      jest.advanceTimersByTime(10000);
      expect(countdownclock.getSecondsRemaining()).toEqual(90);
      expect(countdownclock.getSecondsElapsed()).toEqual(10);
      expect(countdownclock.getGameDuration()).toEqual({"countdown": 90, "duration": 10});
      countdownclock.stop();
      jest.advanceTimersByTime(10000);
      expect(countdownclock.getSecondsRemaining()).toEqual(90);
    });

    it('subscribe tick, and subscribe time up', () => {
        const countdownclock=new CountdownClock(10);
        jest.useFakeTimers();
        var count=0;
        countdownclock.subscribeTick(() => {
            count++;
        });
        countdownclock.subscribeTimeUp(() => {
            count=-1;
        });
        countdownclock.start();
        jest.advanceTimersByTime(9000);
        expect(count).toEqual(9);
        jest.advanceTimersByTime(1000);
        expect(count).toEqual(-1);




    })
  
    
  
  });
