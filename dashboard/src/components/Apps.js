import React from "react";
import { Link } from "react-router-dom";

const Apps = () => {
  const apps = [
    {
      title: "Portfolio overview",
      description: "Review your holdings and see an illustrative portfolio summary.",
      to: "/holdings",
      action: "View holdings",
    },
    {
      title: "Watchlist",
      description: "Search, add, and manage symbols saved to your watchlist.",
      to: "/",
      action: "Open watchlist",
    },
    {
      title: "Order history",
      description: "Review simulated orders saved to your account.",
      to: "/orders",
      action: "View orders",
    },
    {
      title: "Positions",
      description: "See the sample positions displayed in this demo dashboard.",
      to: "/positions",
      action: "View positions",
    },
  ];

  return (
    <section className="apps-page">
      <div className="apps-page__heading">
        <div>
          <h2>Apps</h2>
          <p>Shortcuts to tools in your dashboard</p>
        </div>
        <span className="demo-badge">DEMO</span>
      </div>
      <p className="demo-data-notice">
        These are dashboard shortcuts and previews. They do not connect to a
        broker or place real trades.
      </p>
      <div className="apps-grid">
        {apps.map((app) => (
          <article className="app-card" key={app.title}>
            <h3>{app.title}</h3>
            <p>{app.description}</p>
            <Link to={app.to}>{app.action} <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Apps;