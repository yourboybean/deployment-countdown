
import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const padNumber = (num: number): string => {
  return num.toString().padStart(2, "0");
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center mx-4">
    <div className="text-7xl md:text-9xl font-bold text-timer-text tracking-tight animate-number-change backdrop-blur-sm">
      {padNumber(value)}
    </div>
    <div className="text-timer-label text-sm md:text-base mt-2 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

const Separator: React.FC = () => (
  <div className="text-7xl md:text-9xl text-timer-text font-light animate-separator-pulse self-start mt-2">
    :
  </div>
);

export const CountdownTimer: React.FC = () => {
  const [targetDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-timer-background p-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center justify-center flex-wrap">
          <TimeUnit value={timeLeft.days} label="Days" />
          <Separator />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <Separator />
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </div>
  );
};
