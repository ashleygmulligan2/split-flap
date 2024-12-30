import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import SplitFlapDisplay from "./components/SplitFlapDisplay";
// CoinGecko API key
const COINGECKO_API_KEY = "CG-B9dykQhgqEKR5vrUKsCvBzap";

// Replace 'YOUR_FINNHUB_API_KEY' with your actual Finnhub API key
const FINNHUB_API_KEY = "ctlf8j1r01qv7qq24gv0ctlf8j1r01qv7qq24gvg";

const SYMBOLS = {
  crypto: ["bitcoin", "cardano"], // CoinGecko IDs
  stocks: ["CIFR", "MSTR", "TSLA", "FBTC"], // Stock symbols
};

const DISPLAY_NAMES = {
  bitcoin: "BTC",
  cardano: "ADA",
};

const REFRESH_INTERVAL = 300000; // 5 minutes

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
  const [lastStockFetchTime, setLastStockFetchTime] = useState(0);

  // Use a custom environment variable to determine API usage
  const useRealApi = true;

  const fetchAllPrices = () => {
    if (!useRealApi) {
      // Use demo data in development
      const { cryptoPrices, cryptoChanges, stockPrices, stockChanges } =
        generateMockData();
      setPrices({ ...cryptoPrices, ...stockPrices });
      setChanges({ ...cryptoChanges, ...stockChanges });
    } else {
      // Use real API
      fetchCryptoPrices()
        .then((cryptoData) => {
          setPrices((prevPrices) => ({ ...prevPrices, ...cryptoData.prices }));
          setChanges((prevChanges) => ({
            ...prevChanges,
            ...cryptoData.changes,
          }));
        })
        .catch((error) => {
          console.error("Error fetching crypto prices:", error);
        });

      // Fetch stock prices less frequently
      if (Date.now() - lastStockFetchTime > REFRESH_INTERVAL) {
        fetchStockPrices()
          .then((stockData) => {
            setPrices((prevPrices) => ({ ...prevPrices, ...stockData.prices }));
            setChanges((prevChanges) => ({
              ...prevChanges,
              ...stockData.changes,
            }));
            setLastStockFetchTime(Date.now());
          })
          .catch((error) => {
            console.error("Error fetching stock prices:", error);
          });
      }
    }

    setActiveFlips(SYMBOLS.crypto.length + SYMBOLS.stocks.length);

    if (soundEnabled) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }
  };

  // Function to fetch crypto prices from the real API
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${SYMBOLS.crypto.join(
          ","
        )}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await response.json();

      const prices = {};
      const changes = {};

      SYMBOLS.crypto.forEach((crypto) => {
        prices[crypto] = data[crypto].usd;
        changes[crypto] = data[crypto].usd_24h_change;
      });

      return { prices, changes };
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      return { prices: {}, changes: {} };
    }
  };

  // Function to fetch stock prices from the real API
  const fetchStockPrices = async () => {
    try {
      const prices = {};
      const changes = {};

      for (const symbol of SYMBOLS.stocks) {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const data = await response.json();

        if (!data.c) {
          console.error(`No data for symbol: ${symbol}`, data);
          continue;
        }

        prices[symbol] = data.c; // Current price
        changes[symbol] = ((data.c - data.pc) / data.pc) * 100; // Percentage change from previous close
      }

      return { prices, changes };
    } catch (error) {
      console.error("Error fetching stock prices:", error);
      return { prices: {}, changes: {} };
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

  const formatPrice = (price) => {
    // console.log("Formatting price:", price);
    return price < 100 ? price.toFixed(2) : price.toFixed(0);
  };

  return (
    <div className="App">
      <div className="ticker-container">
        {[...SYMBOLS.crypto, ...SYMBOLS.stocks].map((symbol) => (
          <SplitFlapDisplay
            key={symbol}
            symbol={DISPLAY_NAMES[symbol] || symbol.toUpperCase()}
            price={formatPrice(prices[symbol] || 0)}
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
