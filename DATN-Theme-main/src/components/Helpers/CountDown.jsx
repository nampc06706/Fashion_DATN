/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from "react";

function CountDown(lastDate) {
  const [showDate, setDate] = useState(0);
  const [showHour, setHour] = useState(0);
  const [showMinute, setMinute] = useState(0);
  const [showSecound, setSecound] = useState(0);

  // Convert provided date
  const provideDate = new Date(lastDate);

  // Time units
  const _seconds = 1000;
  const _minutes = _seconds * 60;
  const _hours = _minutes * 60;
  const _date = _hours * 24;

  // Interval function
  const startInterval = () => {
    const timer = setInterval(() => {
      const now = new Date();
      const distance = provideDate.getTime() - now.getTime();

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      // Update state
      setDate(Math.floor(distance / _date));
      setHour(Math.floor((distance % _date) / _hours));
      setMinute(Math.floor((distance % _hours) / _minutes));
      setSecound(Math.floor((distance % _minutes) / _seconds));
    }, 1000);

    return timer; // Return timer for cleanup
  };

  // Effect to start timer
  useEffect(() => {
    if (lastDate) {
      const timer = startInterval();
      return () => clearInterval(timer); // Cleanup when component unmounts
    }
  }, [lastDate]); // Only re-run if lastDate changes

  return { showDate, showHour, showMinute, showSecound };
}

export default CountDown;
