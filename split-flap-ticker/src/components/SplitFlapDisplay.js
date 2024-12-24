import React, { useEffect, useState } from "react";
import "./SplitFlapDisplay.css";

const CHARS = "0123456789.,ABCDEFGHIJKLMNOPQRSTUVWXYZ $%-/";

const SplitFlapCell = ({ target, duration = 50, style, onComplete }) => {
  const [current, setCurrent] = useState(target);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (target === current) return;

    setFlipping(true);
    let currentIndex = CHARS.indexOf(current);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % CHARS.length;
      setCurrent(CHARS[currentIndex]);

      if (CHARS[currentIndex] === target) {
        clearInterval(interval);
        setFlipping(false);
        if (onComplete) onComplete();
      }
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [target, current, duration, onComplete]);

  return (
    <div className={`split-flap-cell ${flipping ? "flipping" : ""}`}>
      <span style={style}>{current}</span>
    </div>
  );
};

const SplitFlapDisplay = ({ symbol, price, change, onFlippingComplete }) => {
  const changeColor = change > 0 ? "#009a44" : "#da291c";
  const changeSign = change < 0 ? "-" : " ";
  const changeText = `${Math.abs(change).toFixed(1)}%`;

  // Use the price directly without Math.ceil
  const priceText = `$${Number(price).toLocaleString()}`;

  // Define a color mapping for each ticker
  // const tickerColors = {
  //   BTC: "#f7931a", // Bitcoin
  //   ADA: "#0033ad", // Cardano
  //   CIFR: "#ff6600", // Example color for CIFR
  //   MSTR: "#ff0000", // Example color for MSTR
  //   TSLA: "#cc0000", // Example color for TSLA
  //   FBTC: "#00cc00", // Example color for FBTC
  //   SPX: "#0000cc", // Example color for SPX
  //   DJI: "#cccc00", // Example color for DJI
  // };

  // Get the color for the current ticker symbol
  // const tickerColor = tickerColors[symbol] || "#2a2a2a"; // Default color if not specified

  // Ensure the ticker symbol is at least 4 characters long
  const paddedSymbol = symbol.padEnd(4, " ");
  const paddedChangeText = changeText.padEnd(5, " "); // Reduced to 5 cells for change
  const paddedPriceText = priceText.padStart(8, " "); // Assuming 8 cells for price

  return (
    <div
      className="split-flap-display"
      style={{ padding: "10px", borderRadius: "8px" }}
    >
      {/* <SplitFlapCell target=" " style={{ backgroundColor: tickerColor }} /> */}
      {/* Ticker Symbol */}
      {paddedSymbol.split("").map((char, index) => (
        <SplitFlapCell
          key={`symbol-${index}`}
          target={char.toUpperCase()}
          onComplete={onFlippingComplete}
        />
      ))}
      <SplitFlapCell target=" " />

      {/* Change Sign */}
      <SplitFlapCell target={changeSign} onComplete={onFlippingComplete} />

      {/* Percentage Change */}
      {paddedChangeText.split("").map((char, index) => (
        <SplitFlapCell
          key={`change-${index}`}
          target={char.toUpperCase()}
          onComplete={onFlippingComplete}
        />
      ))}
      {/* Change Indicator */}
      <SplitFlapCell
        target=" "
        style={{ backgroundColor: changeColor }}
        onComplete={onFlippingComplete}
      />

      {/* Current Price */}
      {paddedPriceText.split("").map((char, index) => (
        <SplitFlapCell
          key={`price-${index}`}
          target={char.toUpperCase()}
          onComplete={onFlippingComplete}
        />
      ))}
    </div>
  );
};

export default SplitFlapDisplay;
