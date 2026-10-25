import React, { useEffect, useState } from "react";
import { api } from "../api";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/allPositions")
      .then((response) => setPositions(response.data))
      .catch((loadError) => {
        console.error("Could not load positions:", loadError);
        setError("Could not load positions.");
      });
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>
      {positions.some((position) => position.isDemo) && (
        <p className="demo-data-notice">
          Sample positions for display only. These are not live trades or investment advice.
        </p>
      )}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((stock) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {positions.length === 0 && <p>No positions yet.</p>}
      </div>
    </>
  );
};

export default Positions;