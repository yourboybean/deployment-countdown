
import React, { useState, useEffect } from "react";

interface TimeLeft {
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
    date: "20 Feb",
    product: "Deployment Countdown",
    description: "A calendar to track the things I deploy",
    link: "https://camdenbean.com",
  },
  {
    date: "24 Feb",
    product: "UFO",
    description: "A crowdsourced leaderboard of the best operators in Utah",
    link: "https://www.utahbest.tech/",
  },
];

// Fixed deadline: Every Thursday at 11:59 PM
const getTimeLeft = (): TimeLeft => {
  const now = new Date();
  
  // Calculate the next Thursday at 11:59 PM
  const targetDay = 4; // 0 = Sunday, 4 = Thursday
  let daysUntilTarget = targetDay - now.getDay();
  
  // If it's past Thursday, or it's Thursday but past 11:59 PM, target the next week
  if (daysUntilTarget < 0 || (daysUntilTarget === 0 && (now.getHours() > 23 || (now.getHours() === 23 && now.getMinutes() >= 59)))) {
    daysUntilTarget += 7;
  }
  
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilTarget);
  nextThursday.setHours(23, 59, 0, 0);
  
  // Calculate time difference
  const difference = nextThursday.getTime() - now.getTime();
  
  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  // Calculate hours, minutes and seconds
  const totalHours = Math.floor(difference / (1000 * 60 * 60));
  
  return {
    hours: totalHours,
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [logs] = useState<DeploymentLog[]>(deploymentLogs);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-timer-background p-2 sm:p-4 pt-8 sm:pt-20">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl mb-6 sm:mb-12 w-full max-w-4xl">
        <h1 className="text-timer-text text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-8 text-center">
          Next Deployment
        </h1>
        <div className="flex items-center justify-center">
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
              {logs.map((log, index) => (
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
