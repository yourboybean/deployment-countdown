import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface DeploymentLog {
  date: string;
  product: string;
  description: string;
  link: string;
}

const deploymentLogs: DeploymentLog[] = [
  {
    date: "14 Mar",
    product: "Feature X",
    description: "Major update to the core functionality",
    link: "https://example.com/release-1",
  },
  {
    date: "07 Mar",
    product: "Service Y",
    description: "Performance improvements and bug fixes",
    link: "https://example.com/release-2",
  },
  {
    date: "29 Feb",
    product: "Component Z",
    description: "New user interface components",
    link: "https://example.com/release-3",
  },
];

const getNextThursday = (): Date => {
  const now = new Date();
  const targetDay = 4; // 0 = Sunday, 4 = Thursday
  let daysUntilTarget = targetDay - now.getDay();
  
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7; // Move to next week if we're past Thursday
  }
  
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilTarget);
  nextThursday.setHours(23, 59, 0, 0);
  
  return nextThursday;
};

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

const TimeUnit: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex flex-col items-center mx-2 md:mx-4">
    <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-timer-text tracking-tight animate-number-change">
      {padNumber(value)}
    </div>
  </div>
);

const Separator: React.FC = () => (
  <div className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl text-timer-text font-light animate-separator-pulse self-start mt-1 md:mt-2">
    :
  </div>
);

export const CountdownTimer: React.FC = () => {
  const [targetDate, setTargetDate] = useState(getNextThursday());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      
      // If timer has reached zero, set new target date
      if (Object.values(newTimeLeft).every(value => value === 0)) {
        setTargetDate(getNextThursday());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-timer-background p-2 sm:p-4 pt-8 sm:pt-20">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl mb-6 sm:mb-12 w-full max-w-4xl">
        <h1 className="text-timer-text text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-8 text-center">
          Next Deployment
        </h1>
        <div className="flex items-center justify-center">
          <TimeUnit value={timeLeft.days} />
          <Separator />
          <TimeUnit value={timeLeft.hours} />
          <Separator />
          <TimeUnit value={timeLeft.minutes} />
          <Separator />
          <TimeUnit value={timeLeft.seconds} />
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-timer-text text-sm sm:text-base">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold">Date</th>
                <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold">Product</th>
                <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold hidden sm:table-cell">Description</th>
                <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold">Link</th>
              </tr>
            </thead>
            <tbody>
              {deploymentLogs.map((log, index) => (
                <tr 
                  key={index} 
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-2 sm:py-3 px-3 sm:px-4">{log.date}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">{log.product}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 hidden sm:table-cell">{log.description}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
                    <a 
                      href={log.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
