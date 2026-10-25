import React from "react";

const demoBalances = [
  { label: "Available margin", value: "₹4,043.10", emphasis: true },
  { label: "Used margin", value: "₹3,757.30" },
  { label: "Available cash", value: "₹4,043.10", emphasis: true },
  { label: "Opening balance", value: "₹7,800.40" },
  { label: "Today's pay-in", value: "₹0.00" },
  { label: "Collateral", value: "₹0.00" },
];

const Funds = () => (
  <section className="funds-page">
    <div className="funds-page__heading">
      <div>
        <h2>Funds</h2>
        <p>Example account balance overview</p>
      </div>
      <span className="demo-badge">DEMO</span>
    </div>

    <p className="demo-data-notice">
      These figures are sample values for preview only. No real balance, deposit,
      or withdrawal is connected.
    </p>

    <div className="funds-grid">
      {demoBalances.map(({ label, value, emphasis }) => (
        <article className="funds-card" key={label}>
          <p>{label}</p>
          <strong className={emphasis ? "is-emphasized" : ""}>{value}</strong>
        </article>
      ))}
    </div>

    <p className="funds-disclaimer">
      Fund transfers will be available only after a secure payment provider and
      verified account integration are configured.
    </p>
  </section>
);

export default Funds;
