import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (timestamp: string): TimeLeft => {
  const now = new Date().getTime();
  const deactivateTime = parseInt(timestamp) * 1000;
  const difference = deactivateTime - now;

  let timeLeft = {} as TimeLeft;

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
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
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(timestamp));

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(timestamp);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timestamp, timeLeft, onComplete]);

  return timeLeft;
};
