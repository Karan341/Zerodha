import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";

import "./DashboardAssistant.css";

const formatRupees = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const suggestions = [
  "Portfolio summary",
  "Portfolio health check",
  "What if market drops 5%?",
  "This week's activity",
  "What does margin mean?",
  "What are positions?",
  "Are these live prices?",
];

const glossary = [
  ["P&L", "Profit and loss: the difference between the displayed current value and invested value."],
  ["Holding", "A security shown in a portfolio, usually with quantity, average cost, and displayed price."],
  ["Position", "An open market exposure or trade. In this demo, positions are illustrative sample entries."],
  ["MIS", "A product label commonly used for intraday positions. This app does not send real MIS orders."],
  ["CNC", "A product label commonly used for delivery holdings. This app does not connect to a broker."],
  ["Margin", "Funds or collateral required to support a trade. The Funds screen here shows sample values only."],
  ["Diversification", "Spreading exposure across different investments. It does not guarantee gains or prevent losses."],
  ["Volatility", "How much an asset's price moves over time; larger swings generally mean more uncertainty."],
  ["Limit order", "An order instruction to trade only at a specified price or better. Real orders are not enabled here."],
  ["Market order", "An instruction to trade at the available market price. Real orders are not enabled here."],
  ["Watchlist", "A saved list of symbols you want to monitor; displayed prices here are sample values."],
];

function getPortfolioMetrics(holdings) {
  const invested = holdings.reduce(
    (total, holding) => total + Number(holding.avg) * Number(holding.qty),
    0
  );
  const current = holdings.reduce(
    (total, holding) => total + Number(holding.price) * Number(holding.qty),
    0
  );
  const pnl = current - invested;
  const valuedHoldings = holdings.map((holding) => ({
    ...holding,
    value: Number(holding.price) * Number(holding.qty),
    pnl: (Number(holding.price) - Number(holding.avg)) * Number(holding.qty),
  }));
  const largestHolding = valuedHoldings.reduce(
    (largest, holding) =>
      !largest || holding.value > largest.value ? holding : largest,
    null
  );

  return {
    invested,
    current,
    pnl,
    valuedHoldings,
    largestHolding,
    largestWeight:
      current > 0 && largestHolding ? (largestHolding.value / current) * 100 : 0,
    lossCount: valuedHoldings.filter((holding) => holding.pnl < 0).length,
  };
}

function answerWhatIf(question, portfolio, loading) {
  if (loading) return "I'm loading your portfolio figures. Try the what-if question again in a moment.";
  if (portfolio.error) return "I couldn't load all portfolio data. Check that the backend is running, then try again.";
  if (portfolio.holdings.length === 0) return "There are no holdings to use in a what-if calculation yet.";

  const percentageMatch = question.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!percentageMatch) {
    return "Tell me a percentage to model, for example: “What if my portfolio drops 5%?”";
  }

  const percentage = Number(percentageMatch[1]);
  if (percentage <= 0 || percentage > 100) {
    return "For this simple scenario, enter a percentage greater than 0 and no more than 100.";
  }

  const query = question.toLowerCase();
  const isDown = /\b(drop|drops|fall|falls|down|decline|decrease|decreases|lose|loss)\b/.test(query);
  const isUp = /\b(up|rise|rises|increase|increases|gain|gains|higher)\b/.test(query);
  if (!isDown && !isUp) {
    return `Should I model a ${percentage}% rise or drop? For example: “What if my portfolio drops ${percentage}%?”`;
  }
  const direction = isDown ? -1 : 1;
  const metrics = getPortfolioMetrics(portfolio.holdings);
  const change = metrics.current * (percentage / 100) * direction;
  const hypotheticalValue = metrics.current + change;
  const hypotheticalPnl = hypotheticalValue - metrics.invested;
  const directionText = direction < 0 ? "drop" : "rise";
  const demo = portfolio.holdings.some((holding) => holding.isDemo);

  return `If all displayed holdings moved together by a ${percentage}% ${directionText}, their value would change by ${formatRupees(change)} to about ${formatRupees(hypotheticalValue)}. Compared with the displayed invested amount, the hypothetical P&L would be ${formatRupees(hypotheticalPnl)}. This is a simplified scenario, not a forecast; it ignores fees, liquidity, and different stock movements.${demo ? " The starting figures are demo data." : ""}`;
}

function answerHealthCheck(portfolio, loading) {
  if (loading) return "I'm loading your portfolio figures. Try the health check again in a moment.";
  if (portfolio.error) return "I couldn't load all portfolio data. Check that the backend is running, then try again.";
  if (portfolio.holdings.length === 0) return "There are no holdings to check yet.";

  const metrics = getPortfolioMetrics(portfolio.holdings);
  const demo = portfolio.holdings.some((holding) => holding.isDemo);
  const observations = [
    `${portfolio.holdings.length} holdings are included in this snapshot.`,
    metrics.largestHolding
      ? `${metrics.largestHolding.name} is ${metrics.largestWeight.toFixed(1)}% of the displayed portfolio value.`
      : "No holding value is available to calculate concentration.",
    `${metrics.lossCount} holding${metrics.lossCount === 1 ? "" : "s"} currently show an unrealized loss using the displayed prices.`,
    `Displayed P&L is ${formatRupees(metrics.pnl)} (${formatRupees(metrics.current)} value vs ${formatRupees(metrics.invested)} invested).`,
  ];
  if (metrics.largestWeight >= 40) {
    observations.push("One holding makes up at least 40% of this snapshot, so the portfolio is concentrated by this simple measure.");
  } else if (metrics.largestWeight >= 25) {
    observations.push("The largest holding is at least 25% of this snapshot; consider this a concentration observation, not a recommendation.");
  } else {
    observations.push("No single holding exceeds 25% of this snapshot by displayed value.");
  }

  return `Portfolio health snapshot:\n• ${observations.join("\n• ")}\n${demo ? "These are demo figures, not live market values." : ""} This check is descriptive only; it doesn't assess suitability or recommend trades.`;
}

function answerWeeklyActivity(orders, loading, error) {
  if (loading) return "I'm loading your recent activity. Try again in a moment.";
  if (error) return "I couldn't load order activity. Check that the backend is running, then try again.";

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt).getTime();
    return Number.isFinite(createdAt) && createdAt >= weekAgo && createdAt <= now;
  });
  const buys = recentOrders.filter((order) => order.mode?.toUpperCase() === "BUY").length;
  const sells = recentOrders.filter((order) => order.mode?.toUpperCase() === "SELL").length;
  const notional = recentOrders.reduce(
    (total, order) => total + Number(order.qty) * Number(order.price),
    0
  );

  if (recentOrders.length === 0) {
    return "No saved orders were created in the last 7 days. This summary only covers recorded simulated orders, not real broker activity.";
  }

  return `Activity for the last 7 days: ${recentOrders.length} saved simulated order${recentOrders.length === 1 ? "" : "s"} (${buys} buy, ${sells} sell), with displayed order value totaling ${formatRupees(notional)}. This is an activity count, not a performance report, and no order was sent to an exchange.`;
}

function answerGlossary(question) {
  const query = question.toLowerCase();
  const term = glossary.find(([name]) => {
    const normalizedName = name.toLowerCase();
    return new RegExp(`\\b${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(query);
  });

  if (term) return `${term[0]}: ${term[1]}`;
  return `Quick glossary:\n${glossary.slice(0, 7).map(([name, definition]) => `• ${name}: ${definition}`).join("\n")}`;
}

function answerQuestion(question, portfolio, loading) {
  const query = question.toLowerCase();

  if (/\b(buy|sell|recommend|recommendation|should i|target price)\b/.test(query)) {
    return "I can't recommend buying or selling securities. I can explain the figures shown in your dashboard, but they are educational/demo information and not investment advice.";
  }

  if (/\b(live|real.?time|real price|market price)\b/.test(query)) {
    return "No. This dashboard currently uses sample market prices and simulated orders. It is not connected to live exchange data or a broker.";
  }

  if (/\b(what if|scenario|simulate|simulation|drops? \d|rise[s]? \d|falls? \d)\b/.test(query)) {
    return answerWhatIf(question, portfolio, loading);
  }

  if (/\b(health|concentration|diversif|risk check|portfolio check)\b/.test(query)) {
    return answerHealthCheck(portfolio, loading);
  }

  if (/\b(week|weekly|last 7 days|activity summary|recent activity)\b/.test(query)) {
    return answerWeeklyActivity(portfolio.orders, loading, portfolio.error);
  }

  if (/\b(glossary|define|definition|what does .* mean|what is (?:an? )?(?:p&l|mis|cnc|margin|volatility|diversification|limit order|market order|holding|position|watchlist))\b/.test(query)) {
    return answerGlossary(question);
  }

  if (/\b(position|positions|mis|intraday)\b/.test(query)) {
    const count = portfolio.positions?.length ?? 0;
    const hasDemoPositions = portfolio.positions?.some((position) => position.isDemo);
    return `A position represents a trade exposure, often for the current trading session (such as MIS), or a carried holding (such as CNC). Your account currently has ${count} position${count === 1 ? "" : "s"} recorded.${hasDemoPositions ? " These are sample/demo entries, not live trades." : " This dashboard is not connected to a broker."}`;
  }

  if (/\b(order|orders|order history)\b/.test(query)) {
    return portfolio.orders.length
      ? `Your order history has ${portfolio.orders.length} saved simulated order${portfolio.orders.length === 1 ? "" : "s"}. These are recorded for this dashboard only; they are not sent to an exchange.`
      : "You don't have any saved orders yet. Orders created in this dashboard are simulated and are not sent to a broker or exchange.";
  }

  if (/\b(watch.?list|watchlist|stocks? list)\b/.test(query)) {
    return portfolio.watchlist.length
      ? `Your saved watchlist has ${portfolio.watchlist.length} symbol${portfolio.watchlist.length === 1 ? "" : "s"}: ${portfolio.watchlist.join(", ")}. The displayed prices are sample values, not live quotes.`
      : "I couldn't load your saved watchlist just now. You can manage it in the watchlist panel.";
  }

  if (/\b(p&l|profit|loss|return|portfolio|holdings?|summary|invested|value)\b/.test(query)) {
    if (loading) return "I'm loading your portfolio figures. Try that question again in a moment.";
    if (portfolio.error) return "I couldn't load your portfolio data. Check that the backend is running, then refresh the dashboard.";
    if (portfolio.holdings.length === 0) return "There are no holdings recorded in your portfolio yet.";

    const invested = portfolio.holdings.reduce(
      (total, holding) => total + Number(holding.avg) * Number(holding.qty),
      0
    );
    const current = portfolio.holdings.reduce(
      (total, holding) => total + Number(holding.price) * Number(holding.qty),
      0
    );
    const pnl = current - invested;
    const demo = portfolio.holdings.some((holding) => holding.isDemo);
    const topHolding = portfolio.holdings.reduce((top, holding) => {
      const value = Number(holding.price) * Number(holding.qty);
      return !top || value > top.value
        ? { name: holding.name, value }
        : top;
    }, null);

    if (/\b(p&l|profit|loss|return)\b/.test(query)) {
      return `Using the displayed prices, your portfolio P&L is ${formatRupees(pnl)} (current value ${formatRupees(current)} minus invested value ${formatRupees(invested)}). ${demo ? "These are sample figures, not real returns." : "This calculation is informational and isn't investment advice."}`;
    }

    return `You have ${portfolio.holdings.length} holding${portfolio.holdings.length === 1 ? "" : "s"}. Invested: ${formatRupees(invested)}; displayed current value: ${formatRupees(current)}; P&L: ${formatRupees(pnl)}.${topHolding ? ` Largest displayed holding by value: ${topHolding.name} (${formatRupees(topHolding.value)}).` : ""} ${demo ? "Figures are demo/sample data, not live market values." : ""}`;
  }

  if (/\b(help|what can you do|features|how to)\b/.test(query)) {
    return "I can summarize holdings and P&L, run a descriptive portfolio health check, model a percentage up/down scenario, summarize the last 7 days of simulated order activity, define market terms, and list your watchlist. This uses local rules and app data—no paid AI service or external API.";
  }

  return "I can help with your portfolio summary, health check, what-if scenarios, recent activity, market terms, holdings, positions, order history, or watchlist. Try one of the suggested questions. I don't provide buy/sell recommendations.";
}

const DashboardAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState({
    holdings: [],
    orders: [],
    watchlist: [],
    error: false,
  });
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Hi! I'm your free, local dashboard helper. Ask for a portfolio health check, a percentage what-if scenario, a 7-day activity summary, or a market-terms definition.",
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    const loadPortfolio = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        api.get("/allHoldings"),
        api.get("/orders"),
        api.get("/watchlist"),
        api.get("/allPositions"),
      ]);

      if (cancelled) return;
      const [holdings, orders, watchlist, positions] = results;
      const failed = results.some((result) => result.status === "rejected");
      if (failed) {
        console.error(
          "Some dashboard assistant data could not be loaded:",
          results
            .filter((result) => result.status === "rejected")
            .map((result) => result.reason)
        );
      }
      setPortfolio({
        holdings: holdings.status === "fulfilled" ? holdings.value.data : [],
        orders: orders.status === "fulfilled" ? orders.value.data : [],
        watchlist:
          watchlist.status === "fulfilled" ? watchlist.value.data.symbols : [],
        positions:
          positions.status === "fulfilled" ? positions.value.data : [],
        error: failed,
      });
      setLoading(false);
    };

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendQuestion = (submittedQuestion) => {
    const trimmedQuestion = submittedQuestion.trim();
    if (!trimmedQuestion) return;

    setQuestion("");
    setMessages((current) => [
      ...current,
      { from: "user", text: trimmedQuestion },
      { from: "assistant", text: answerQuestion(trimmedQuestion, portfolio, loading) },
    ]);
  };

  return (
    <div className="dashboard-assistant">
      {isOpen && (
        <section
          className="assistant-panel"
          aria-label="Dashboard assistant"
          aria-live="polite"
        >
          <header className="assistant-header">
            <div>
              <strong>Dashboard helper</strong>
              <span>Free · local calculations, no paid AI API</span>
            </div>
            <button
              type="button"
              className="assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div className="assistant-messages">
            {messages.map((message, index) => (
              <p
                className={`assistant-message assistant-message--${message.from}`}
                key={`${message.from}-${index}`}
              >
                {message.text}
              </p>
            ))}
            {loading && <p className="assistant-loading">Checking dashboard data…</p>}
            <div ref={messagesEndRef} />
          </div>

          <div className="assistant-suggestions">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => sendQuestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="assistant-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendQuestion(question);
            }}
          >
            <input
              aria-label="Ask the dashboard helper"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about your dashboard…"
              maxLength={240}
            />
            <button type="submit" disabled={!question.trim()}>
              Send
            </button>
          </form>
          <p className="assistant-disclaimer">
            Informational only—not investment advice. No paid AI or external API.
          </p>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close dashboard helper" : "Open dashboard helper"}
      >
        {isOpen ? "Close helper" : "Ask helper"}
      </button>
    </div>
  );
};

export default DashboardAssistant;
