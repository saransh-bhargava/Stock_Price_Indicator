import React, { useState, useEffect } from "react";
import "./App.css";

const STOCKS = [
  { symbol: "NVDA", name: "NVIDIA Corp.", priceUsd: 156.14, change: -4.12 },
  { symbol: "AAPL", name: "Apple Inc.", priceUsd: 228.1, change: -0.45 },
  { symbol: "META", name: "Meta Platforms", priceUsd: 585.2, change: 1.18 },
  { symbol: "MSFT", name: "Microsoft Corp.", priceUsd: 425.75, change: 0.82 },
  { symbol: "GOOGL", name: "Alphabet Inc.", priceUsd: 176.4, change: -0.6 },
  { symbol: "NFLX", name: "Netflix Inc.", priceUsd: 60.75, change: -2.25 },
];

export default function App() {
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(93.33);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    async function generateRate() {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v1/latest?from=USD&to=INR",
        );
        const data = await response.json();

        if (data?.rates?.INR) {
          setRate(data.rates.INR);
        }
      } catch (error) {
        console.log("Failed to fetch rates", error);
      }
    }
    generateRate();
  }, []);

  const formatPrice = (usd) => {
    const value = currency === "INR" ? usd * rate : usd;
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Top Header */}
        <header className="header">
          <div>
            <h1 className="title">Stock Price Indicator</h1>
            <p className="subtitle">
              <span className="status-dot" />
              Market Overview • 1 USD = ₹{rate}
            </p>
          </div>

          {/* Top-Right Currency Toggle */}
          <div
            className="toggle-group"
            role="group"
            aria-label="Currency Toggle"
          >
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle Dark or Light Mode"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              className={`toggle-btn ${currency === "USD" ? "active" : ""}`}
              onClick={() => setCurrency("USD")}
            >
              USD ($)
            </button>
            <button
              className={`toggle-btn ${currency === "INR" ? "active" : ""}`}
              onClick={() => setCurrency("INR")}
            >
              INR (₹)
            </button>
          </div>
        </header>

        {/* 5 Stock Tickets Grid */}
        <main className="stock-grid">
          {STOCKS.map((stock) => {
            const isPositive = stock.change >= 0;

            return (
              <div key={stock.symbol} className="stock-card">
                <div className="card-header">
                  <div>
                    <h2 className="ticker">{stock.name}</h2>
                    <p className="company-name">{stock.symbol}</p>
                  </div>

                  <span
                    className={`badge ${isPositive ? "positive" : "negative"}`}
                  >
                    {isPositive ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </span>
                </div>

                <div className="card-price">{formatPrice(stock.priceUsd)}</div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
