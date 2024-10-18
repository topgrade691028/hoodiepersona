import { useEffect, useState } from "react";

export default function CountDown({
  timeLeft = 0,
  init = () => { }
}) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    if (time == 0) {
      init()
    }
  }, [time])

  useEffect(() => {
    setTime(timeLeft)
  }, [timeLeft])

  useEffect(() => {
    const interval = setInterval(() => {
        setTime((time) => time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="text-[56px] md:w-2/5 text-center">{Math.floor(time / 3600)} : {Math.floor((time % 3600) / 60)} : {Math.floor(time % 60)}</div>
  );
}
