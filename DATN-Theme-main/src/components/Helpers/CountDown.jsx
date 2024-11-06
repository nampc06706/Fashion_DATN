import { useState, useEffect } from "react";

const CountDown = (endDate) => {
  const [timeLeft, setTimeLeft] = useState({
    showDate: 0,
    showHour: 0,
    showMinute: 0,
    showSecound: 0,
  });

  useEffect(() => {
    if (!endDate) return; // Nếu endDate không hợp lệ thì không làm gì cả
  
    const interval = setInterval(() => {
      const now = new Date();
      const distance = new Date(endDate) - now;
  
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({
          showDate: 0,
          showHour: 0,
          showMinute: 0,
          showSecound: 0,
        });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
        setTimeLeft({
          showDate: days,
          showHour: hours,
          showMinute: minutes,
          showSecound: seconds,
        });
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [endDate]);  

  return timeLeft;
};

export default CountDown;
