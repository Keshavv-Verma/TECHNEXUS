import React from "react";
import "./LedSection.css";
import smartTv from "../../assest/smartTv.png";

const LedSection = () => {
  return (
    <div className="led-section ">
      <div className="led-container">
        <div className="led-text">
          <h1>NTC 50" UHD Smart Android TV</h1>
          <p>
            A slim, frameless design, ultra-high-definition resolution and
            built-in high-speed streaming services are just some of the
            incredible high-end features available in this smart Android TV from
            NTC. It brings beautiful picture quality on its LED screen,
            Chromecast content streaming and works with “Hey Google” for
            convenient binge-watching experiences with family and friends.
          </p>
          <div className="tv-price">
            <h4>₹ 39,000</h4>
            <span className="perice-percent">-50%*</span>
          </div>
          <button className="button-86">Shop Now</button>
        </div>
        <div className="led-image">
          <img src={smartTv} alt="tv image" />
        </div>
      </div>
    </div>
  );
};

export default LedSection;
