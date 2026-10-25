import React, { useContext, useState } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBuyClick = async () => {
    if (Number(stockQuantity) <= 0 || Number(stockPrice) <= 0) {
      setError("Quantity and price must be greater than zero.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
     
await axios.post(
  "https://zerodha-backend-2ozm.onrender.com/newOrder",
  {
    name: uid,
    qty: Number(stockQuantity),
    price: Number(stockPrice),
    mode: "BUY",
  },
  { withCredentials: true }
);

      closeBuyWindow();
    } catch (submitError) {
      console.error("Could not save simulated order:", submitError);
      setError(
        submitError.response?.data?.message || "Could not place the order."
      );
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              step="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              min="0.01"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Simulated order only. No live trade is placed.</span>
        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Buy"}
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
        {error && <p role="alert">{error}</p>}
      </div>
    </div>
  );
};

export default BuyActionWindow;