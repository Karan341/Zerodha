import React from "react";

const accountOpeningTopics = [
  "Online Account Opening",
  "Offline Account Opening",
  "Company, Partnership and HUF Account Opening",
  "NRI Account Opening",
  "Charges at Zerodha",
  "Zerodha IDFC FIRST Bank 3-in-1 Account",
  "Getting Started",
];

function CreateTicket() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2">To create a ticket, select a relevant topic</h1>
        {[0, 1, 2].map((column) => (
          <div className="col-12 col-md-4 p-5 mt-2 mb-2" key={column}>
            <h4>
              <i className="fa fa-plus-circle" aria-hidden="true" /> Account Opening
            </h4>
            {accountOpeningTopics.map((topic) => (
              <React.Fragment key={topic}>
                <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
                  {topic}
                </a>
                <br />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateTicket;
