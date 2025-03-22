import React from "react";
import "./Featured.scss";
import searchIcon from "../../assets/images/icons/search.png";
import testIcon from "../../assets/images/icons/test.png";

const Featured = () => {
  return (
    <section className="featured">
      <div className="container">
        {/* Left Section */}
        <div className="left">
          <h1>Find the perfect <span className="highlight">freelance services</span> for your business.</h1>

          {/* Search Bar */}
          <div className="search">
            <div className="searchInput">
              <img src={searchIcon} alt="Search Icon" />
              <input
                type="text"
                placeholder="Try building a mobile app..."
                aria-label="Search services"
              />
            </div>
            <button aria-label="Search">Search</button>
          </div>

          {/* Popular Services */}
          <div className="popular">
            <span>Popular:</span>
            {["Web Design", "WordPress", "Logo Design", "AI Services"].map((service, index) => (
              <button key={index} className="popular-btn">{service}</button>
            ))}
          </div>
        </div>

        {/* Right Section (New Image) */}
        <div className="right">
          <img src={testIcon}alt="Freelancer Working" />
        </div>
      </div>
    </section>
  );
};

export default Featured;
