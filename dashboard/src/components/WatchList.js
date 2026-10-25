import React, { useContext, useEffect, useMemo, useState } from "react";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import GeneralContext from "./GeneralContext";
import { api } from "../api";
import { watchlist as marketWatchlist, holdings } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const stockCatalog = Array.from(
  new Map(
    [...marketWatchlist, ...holdings].map((stock) => [stock.name, stock])
  ).values()
);
const stockByName = new Map(stockCatalog.map((stock) => [stock.name, stock]));

const WatchList = () => {
  const [symbols, setSymbols] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const { data } = await api.get("/watchlist");
        setSymbols(data.symbols);
      } catch (loadError) {
        console.error("Could not load saved watchlist:", loadError);
        setError("Could not load your watchlist.");
      }
    };

    loadWatchlist();
  }, []);

  const stocks = useMemo(
    () =>
      symbols.map(
        (symbol) =>
          stockByName.get(symbol) || {
            name: symbol,
            price: 0,
            percent: "—",
            isDown: false,
          }
      ),
    [symbols]
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toUpperCase();
    if (!query) return [];
    return stockCatalog
      .filter(
        (stock) =>
          stock.name.includes(query) && !symbols.includes(stock.name)
      )
      .slice(0, 5);
  }, [search, symbols]);

  const saveSymbols = async (nextSymbols) => {
    setError("");
    try {
      const { data } = await api.put("/watchlist", { symbols: nextSymbols });
      setSymbols(data.symbols);
      setSearch("");
    } catch (saveError) {
      console.error("Could not save watchlist:", saveError);
      setError(
        saveError.response?.data?.message || "Could not save your watchlist."
      );
    }
  };

  const chartData = {
    labels: stocks.map((stock) => stock.name),
    datasets: [
      {
        label: "Price",
        data: stocks.map((stock) => Number(stock.price) || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search and add a stock"
          className="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search stocks to add to watchlist"
        />
        <span className="counts">{symbols.length} / 50</span>
        {searchResults.length > 0 && (
          <ul className="watchlist-suggestions">
            {searchResults.map((stock) => (
              <li key={stock.name}>
                <button
                  type="button"
                  onClick={() => saveSymbols([...symbols, stock.name])}
                >
                  <span>{stock.name}</span>
                  <span>Add</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="watchlist-error" role="alert">{error}</p>}

      <ul className="list">
        {stocks.map((stock) => (
          <WatchListItem
            key={stock.name}
            stock={stock}
            onRemove={() =>
              saveSymbols(symbols.filter((symbol) => symbol !== stock.name))
            }
          />
        ))}
      </ul>

      {stocks.length > 0 && <DoughnutChart data={chartData} />}
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">{stock.price}</span>
          <button
            type="button"
            className="watchlist-remove"
            onClick={onRemove}
            aria-label={`Remove ${stock.name} from watchlist`}
          >
            ×
          </button>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button
            className="buy"
            onClick={() => generalContext.openBuyWindow(uid)}
          >
            Buy
          </button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell">Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
