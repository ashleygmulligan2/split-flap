import React, { useState, useEffect } from "react";
import SplitFlapDisplay from "./components/SplitFlapDisplay";
import "./App.css";

const SYMBOLS = {
  crypto: ["bitcoin"], // Bitcoin
  stocks: ["coinbase", "tesla"], // COIN and TSLA
};

const REFRESH_INTERVAL = 15000; // 15 seconds to avoid rate limits

function App() {
  const [prices, setPrices] = useState({});

  const fetchPrices = async () => {
    try {
      // Get all prices in one API call
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${[
          ...SYMBOLS.crypto,
          ...SYMBOLS.stocks,
        ].join(",")}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Format the prices
      const newPrices = {};
      [...SYMBOLS.crypto, ...SYMBOLS.stocks].forEach((symbol) => {
        if (data[symbol]) {
          newPrices[symbol.toUpperCase()] = data[symbol].usd;
        }
      });

      setPrices(newPrices);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="ticker-container">
        {[...SYMBOLS.crypto, ...SYMBOLS.stocks].map((symbol) => (
          <SplitFlapDisplay
            key={symbol}
            symbol={symbol.toUpperCase()}
            price={prices[symbol.toUpperCase()]?.toFixed(2) || "0.00"}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
