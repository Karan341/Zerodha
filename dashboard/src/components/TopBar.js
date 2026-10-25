import React from "react";

import Menu from "./Menu";

const TopBar = ({ userId, username }) => {
  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="index-sample-list" aria-label="Illustrative index values">
          <div className="nifty">
            <span className="index">NIFTY 50</span>
            <span className="index-points">24,850.50</span>
            <span className="percent">+0.42%</span>
          </div>
          <div className="sensex">
            <span className="index">SENSEX</span>
            <span className="index-points">81,350.20</span>
            <span className="percent">+0.38%</span>
          </div>
        </div>
        <span className="market-data-status" role="status">
          Sample · not live
        </span>
      </div>

      <Menu userId={userId} username={username} />
    </div>
  );
};

export default TopBar;