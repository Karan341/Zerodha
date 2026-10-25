import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { DoughnutChart } from "./DoughnoutChart";

const formatRupees = (amount) => {
  const value = Number(amount || 0);
  return `${value < 0 ? "-" : ""}₹${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const chartColors = [
  "#387ed1",
  "#16a085",
  "#e6a23c",
  "#8e6bc2",
  "#d66b6b",
  "#36a2a0",
  "#7e8c9a",
  "#c47c49",
  "#5680a8",
];

const Summary = ({ username }) => {
  const [holdings, setHoldings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadHoldings = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          "http://localhost:3002/allHoldings",
          { withCredentials: true }
        );
        if (!cancelled) setHoldings(data);
      } catch (loadError) {
        console.error("Could not load portfolio summary:", loadError);
        if (!cancelled) setError("Your portfolio summary couldn't be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHoldings();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const portfolio = useMemo(() => {
    const totalInvested = holdings.reduce(
      (total, holding) =>
        total + Number(holding.avg || 0) * Number(holding.qty || 0),
      0
    );
    const totalValue = holdings.reduce(
      (total, holding) =>
        total + Number(holding.price || 0) * Number(holding.qty || 0),
      0
    );
    const profitLoss = totalValue - totalInvested;
    const topHoldings = holdings
      .map((holding) => ({
        ...holding,
        currentValue: Number(holding.price || 0) * Number(holding.qty || 0),
      }))
      .sort((left, right) => right.currentValue - left.currentValue)
      .slice(0, 5);

    return {
      totalInvested,
      totalValue,
      profitLoss,
      profitLossPercent:
        totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0,
      topHoldings,
    };
  }, [holdings]);

  const chartData = useMemo(
    () => ({
      labels: holdings.map((holding) => holding.name),
      datasets: [
        {
          data: holdings.map(
            (holding) =>
              Number(holding.price || 0) * Number(holding.qty || 0)
          ),
          backgroundColor: holdings.map(
            (_, index) => chartColors[index % chartColors.length]
          ),
          borderWidth: 0,
          hoverOffset: 5,
        },
      ],
    }),
    [holdings]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { usePointStyle: true, boxWidth: 8, padding: 14 },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.label}: ${formatRupees(context.raw)}`,
          },
        },
      },
    }),
    []
  );

  const isDemo = holdings.some((holding) => holding.isDemo);

  return (
    <main className="portfolio-overview">
      <header className="overview-heading">
        <div>
          <p className="overview-eyebrow">YOUR ACCOUNT</p>
          <h1>Welcome back{username ? `, ${username}` : ""}</h1>
          <p className="overview-subtitle">
            Here’s a clear snapshot of your portfolio.
          </p>
        </div>
        <Link className="overview-primary-link" to="/holdings">
          View holdings <span aria-hidden="true">→</span>
        </Link>
      </header>

      {isDemo && (
        <p className="demo-data-notice" role="note">
          Demo portfolio · Sample prices only · Not connected to a broker or live
          market feed
        </p>
      )}

      {error && (
        <div className="overview-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="overview-loading" role="status">
          <span className="overview-spinner" aria-hidden="true" />
          Loading portfolio…
        </div>
      ) : !error ? (
        <>
          <section className="overview-metrics" aria-label="Portfolio totals">
            <article className="overview-metric overview-metric--primary">
              <span className="overview-metric-label">Current value</span>
              <strong>{formatRupees(portfolio.totalValue)}</strong>
              <span className="overview-metric-caption">
                Across {holdings.length} holding{holdings.length === 1 ? "" : "s"}
              </span>
            </article>
            <article className="overview-metric">
              <span className="overview-metric-label">Invested</span>
              <strong>{formatRupees(portfolio.totalInvested)}</strong>
              <span className="overview-metric-caption">Total cost value</span>
            </article>
            <article className="overview-metric">
              <span className="overview-metric-label">Total P&amp;L</span>
              <strong
                className={
                  portfolio.profitLoss >= 0
                    ? "overview-value--positive"
                    : "overview-value--negative"
                }
              >
                {formatRupees(portfolio.profitLoss)}
              </strong>
              <span
                className={
                  portfolio.profitLoss >= 0
                    ? "overview-metric-caption overview-value--positive"
                    : "overview-metric-caption overview-value--negative"
                }
              >
                {portfolio.profitLossPercent >= 0 ? "+" : ""}
                {portfolio.profitLossPercent.toFixed(2)}% overall
              </span>
            </article>
          </section>

          {holdings.length > 0 ? (
            <section className="overview-details">
              <article className="overview-card allocation-card">
                <div className="overview-card-heading">
                  <div>
                    <h2>Portfolio allocation</h2>
                    <p>Based on displayed holding values</p>
                  </div>
                </div>
                <div className="allocation-chart">
                  <DoughnutChart data={chartData} options={chartOptions} />
                </div>
              </article>

              <article className="overview-card leaders-card">
                <div className="overview-card-heading">
                  <div>
                    <h2>Largest holdings</h2>
                    <p>Sorted by displayed current value</p>
                  </div>
                  <Link to="/holdings">See all</Link>
                </div>
                <ul className="largest-holdings">
                  {portfolio.topHoldings.map((holding) => {
                    const share =
                      portfolio.totalValue > 0
                        ? (holding.currentValue / portfolio.totalValue) * 100
                        : 0;
                    return (
                      <li key={holding._id || holding.name}>
                        <div className="holding-row">
                          <span className="holding-symbol">{holding.name}</span>
                          <span className="holding-value">
                            {formatRupees(holding.currentValue)}
                          </span>
                        </div>
                        <div
                          className="holding-share-track"
                          role="img"
                          aria-label={`${holding.name}: ${share.toFixed(1)}% of displayed portfolio`}
                        >
                          <span style={{ width: `${Math.min(share, 100)}%` }} />
                        </div>
                        <span className="holding-share-label">
                          {share.toFixed(1)}% of portfolio
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </section>
          ) : (
            <section className="overview-card overview-empty">
              <h2>Your portfolio is ready when you are</h2>
              <p>
                There are no holdings to summarize yet. Any sample entries will
                be clearly marked as demo data.
              </p>
              <Link className="overview-primary-link" to="/holdings">
                Open holdings
              </Link>
            </section>
          )}

          <p className="overview-footnote">
            Informational display only. Values may be illustrative and are not
            live market prices, investment advice, or a record of broker trades.
          </p>
        </>
      ) : null}
    </main>
  );
};

export default Summary;
