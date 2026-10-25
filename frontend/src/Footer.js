import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <img
              src="media/images/logo.svg"
              style={{ width: "50%" }}
              alt="logo"
            />
            <p className="text-muted">
              &copy; 2010 - 2024, Not Zerodha Broking Ltd. All rights reserved.
            </p>
          </div>

          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <p className="text-muted fw-semibold">Company</p>
            <a href="" className="text-decoration-none text-muted">About</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Products</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Pricing</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Referral programme</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Careers</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Zerodha.tech</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Press &amp; media</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Zerodha cares (CSR)</a>
          </div>

          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <p className="text-muted fw-semibold">Support</p>
            <a href="" className="text-decoration-none text-muted">Contact</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Support portal</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Z-Connect blog</a>
            <br />
            <a href="" className="text-decoration-none text-muted">List of charges</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Downloads &amp; resources</a>
          </div>

          <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <p className="text-muted fw-semibold">Account</p>
            <a href="" className="text-decoration-none text-muted">Open an account</a>
            <br />
            <a href="" className="text-decoration-none text-muted">Fund transfer</a>
            <br />
            <a href="" className="text-decoration-none text-muted">60 day challenge</a>
          </div>
        </div>

        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            Zerodha Broking Ltd.: Member of NSE​ &amp;​ BSE – SEBI Registration
            no.: INZ000031633 CDSL: Depository services through Zerodha
            Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015
            Commodity Trading through Zerodha Commodities Pvt. Ltd. MCX: 46025 –
            SEBI Registration no.: INZ000038238 Registered Address: Zerodha
            Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence
            Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka,
            India.
          </p>
          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES
            portal. Mandatory details for filing complaints on SEBI SCORES:
            Name, PAN, Address, Mobile Number, E-mail ID.
          </p>
          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>
          <p>
            Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day.
          </p>
        </div>

        <div
          className="d-flex justify-content-center flex-wrap gap-4 py-4"
          style={{ fontSize: "14px" }}
        >
          <a href="" className="text-decoration-none text-muted">NSE</a>
          <a href="" className="text-decoration-none text-muted">BSE</a>
          <a href="" className="text-decoration-none text-muted">MCX</a>
          <a href="" className="text-decoration-none text-muted">Terms &amp; Conditions</a>
          <a href="" className="text-decoration-none text-muted">Policies &amp; Procedures</a>
          <a href="" className="text-decoration-none text-muted">Privacy Policy</a>
          <a href="" className="text-decoration-none text-muted">Disclosures</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
