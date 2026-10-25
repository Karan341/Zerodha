

import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const formatRupees = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
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
  "https://zerodha-backend-2ozm.onrender.com/allHoldings",
  {
    withCredentials: true,
  }
);

        if (!cancelled) setAllHoldings(data);
      } catch (loadError) {
        console.error("Could not load holdings:", loadError);
        if (!cancelled) setError("Could not load holdings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHoldings();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (loading) {
    return (
      <p className="overview-loading" role="status">
        Loading holdings…
      </p>
    );
  }

  if (error) {
    return (
      <div className="overview-error" role="alert">
        <span>{error}</span>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
          Try again
        </button>
      </div>
    );
  }

  const labels = allHoldings.map((subArray) => subArray["name"]);
  const totalInvestment = allHoldings.reduce(
    (total, holding) =>
      total + Number(holding.avg || 0) * Number(holding.qty || 0),
    0
  );
  const currentValue = allHoldings.reduce(
    (total, holding) =>
      total + Number(holding.price || 0) * Number(holding.qty || 0),
    0
  );
  const profitLoss = currentValue - totalInvestment;

  const data = {
    labels,
    datasets: [
      {
        label: "Current holding value",
        data: allHoldings.map(
          (stock) => Number(stock.price || 0) * Number(stock.qty || 0)
        ),
        backgroundColor: "rgba(56, 126, 209, 0.72)",
        borderRadius: 5,
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      {allHoldings.some((holding) => holding.isDemo) && (
        <p className="demo-data-notice">
          These are illustrative sample holdings, not live market data or real investments.
        </p>
      )}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const price = Number(stock.price || 0);
              const average = Number(stock.avg || 0);
              const quantity = Number(stock.qty || 0);
              const curValue = price * quantity;
              const holdingPnl = (price - average) * quantity;
              const profClass = holdingPnl >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || `${stock.name}-${index}`}>
                  <td>{stock.name}</td>
                  <td>{quantity}</td>
                  <td>{average.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{formatRupees(holdingPnl)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!error && allHoldings.length === 0 && <p>No holdings yet.</p>}
      </div>

      <div className="row">
        <div className="col">
          <h5>{formatRupees(totalInvestment)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{formatRupees(currentValue)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={profitLoss >= 0 ? "profit" : "loss"}>
            {formatRupees(profitLoss)}
          </h5>
          <p>P&L</p>
        </div>
      </div>
      {allHoldings.length > 0 && <VerticalGraph data={data} />}
    </>
  );
};

export default Holdings;