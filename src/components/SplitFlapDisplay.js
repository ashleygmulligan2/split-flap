import React, { useEffect, useState } from "react";
import "./SplitFlapDisplay.css";
import useSound from "./useSound";

const CHARS = "0123456789.,ABCDEFGHIJKLMNOPQRSTUVWXYZ $";

const SplitFlapCell = ({ target, duration = 50 }) => {
  const [current, setCurrent] = useState(target);
  const [flipping, setFlipping] = useState(false);
  const playFlapSound = useSound();

  useEffect(() => {
    if (target === current) return;

    setFlipping(true);
    let currentIndex = CHARS.indexOf(current);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % CHARS.length;
      setCurrent(CHARS[currentIndex]);

      // Play sound when flap changes
      playFlapSound();

      if (CHARS[currentIndex] === target) {
        clearInterval(interval);
        setFlipping(false);
      }
    }, duration);

    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className={`split-flap-cell ${flipping ? "flipping" : ""}`}>
      {current}
    </div>
  );
};

const SplitFlapDisplay = ({ symbol, price }) => {
  const displayText = `${symbol}: $${price}`.padEnd(22, " ");

  return (
    <div className="split-flap-display">
      {displayText.split("").map((char, index) => (
        <SplitFlapCell key={index} target={char.toUpperCase()} />
      ))}
    </div>
  );
};

export default SplitFlapDisplay;
