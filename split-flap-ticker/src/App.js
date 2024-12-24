import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import SplitFlapDisplay from "./components/SplitFlapDisplay";

// Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = "D1OVGLNPM5ZHM0K1";

// CoinGecko API key
const COINGECKO_API_KEY = "CG-B9dykQhgqEKR5vrUKsCvBzap";

const SYMBOLS = {
  crypto: ["bitcoin", "cardano"], // CoinGecko IDs
  stocks: ["CIFR", "MSTR", "TSLA", "FBTC", "SPX", "DJI"], // Stock symbols
};

const DISPLAY_NAMES = {
  bitcoin: "BTC",
  cardano: "ADA",
};

const REFRESH_INTERVAL = 6000; // 1 minute

const generateMockData = () => {
  return {
    cryptoPrices: {
      bitcoin: Math.random() * 100000,
      cardano: Math.random() * 5,
    },
    cryptoChanges: {
      bitcoin: (Math.random() - 0.5) * 2,
      cardano: (Math.random() - 0.5) * 2,
    },
    stockPrices: {
      CIFR: Math.random() * 20,
      MSTR: Math.random() * 1000,
      TSLA: Math.random() * 1000,
      FBTC: Math.random() * 100,
      SPX: Math.random() * 5000,
      DJI: Math.random() * 40000,
    },
    stockChanges: {
      CIFR: (Math.random() - 0.5) * 2,
      MSTR: (Math.random() - 0.5) * 2,
      TSLA: (Math.random() - 0.5) * 2,
      FBTC: (Math.random() - 0.5) * 2,
      SPX: (Math.random() - 0.5) * 2,
      DJI: (Math.random() - 0.5) * 2,
    },
  };
};

function App() {
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeFlips, setActiveFlips] = useState(0);
  const audioRef = useRef(new Audio("/sound.m4a"));

  const fetchAllPrices = () => {
    const { cryptoPrices, cryptoChanges, stockPrices, stockChanges } =
      generateMockData();
    setPrices({ ...cryptoPrices, ...stockPrices });
    setChanges({ ...cryptoChanges, ...stockChanges });
    setActiveFlips(SYMBOLS.crypto.length + SYMBOLS.stocks.length);

    if (soundEnabled) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }
  };

  useEffect(() => {
    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, REFRESH_INTERVAL);
    return () => {
      clearInterval(interval);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [soundEnabled]);

  const handleFlippingComplete = () => {
    setActiveFlips((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return newCount;
    });
  };

  return (
    <div className="App">
      <div className="ticker-container">
        {[...SYMBOLS.crypto, ...SYMBOLS.stocks].map((symbol) => (
          <SplitFlapDisplay
            key={symbol}
            symbol={DISPLAY_NAMES[symbol] || symbol.toUpperCase()}
            price={prices[symbol]?.toFixed(2) || "0.00"}
            change={changes[symbol]}
            onFlippingComplete={handleFlippingComplete}
          />
        ))}
      </div>
      {!soundEnabled && (
        <button
          className="enable-sound-button"
          onClick={() => setSoundEnabled(true)}
        >
          Enable Sound
        </button>
      )}
    </div>
  );
}

export default App;
