import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (timestamp: string): TimeLeft => {
  const now = new Date().getTime();
  const deactivateTime = parseInt(timestamp) * 1000;
  const difference = deactivateTime - now;

  let timeLeft: TimeLeft;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return timeLeft;
};

export const useCountdown = (timestamp: string, onComplete: () => void) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft(timestamp)
  );

  useEffect(() => {
    if (
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(timestamp));
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timestamp,
    onComplete,
    timeLeft.days,
    timeLeft.hours,
    timeLeft.minutes,
    timeLeft.seconds,
  ]);

  return timeLeft;
};

const calculateTimeElapsed = (date: Date): TimeElapsed => {
  const now = new Date();
  const difference = now.getTime() - date.getTime();

  const secondsTotal = Math.floor(difference / 1000);
  const days = Math.floor(secondsTotal / (3600 * 24));
  const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  return { days, hours, minutes, seconds };
};

export const useElapsedTime = (date: Date): TimeElapsed => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>(
    calculateTimeElapsed(date)
  );

  useEffect(() => {
    // Function to update the elapsed time
    const updateElapsedTime = () => {
      setTimeElapsed(calculateTimeElapsed(date));
    };

    // Update immediately
    updateElapsedTime();

    // Set up an interval to update every second
    const timerId = setInterval(updateElapsedTime, 1000);

    // Clean up the interval on component unmount or when date changes
    return () => clearInterval(timerId);
  }, [date]);

  return timeElapsed;
};
