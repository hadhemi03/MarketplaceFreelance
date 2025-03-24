import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slide.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons

// Custom left arrow
const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-arrow custom-prev" onClick={onClick}>
    <FaChevronLeft />
  </button>
);

// Custom right arrow
const CustomNextArrow = ({ onClick }) => (
  <button className="custom-arrow custom-next" onClick={onClick}>
    <FaChevronRight />
  </button>
);

const Slide = ({ children, settings }) => {
  const defaultSettings = {
    dots: true, // Show navigation dots
    infinite: true, // Enable infinite loop scrolling
    speed: 500, // Transition speed
    slidesToShow: 5, // Default: Show 3 slides
    slidesToScroll: 3, // Default: Scroll 1 slide at a time
    arrows: true, // Enable arrows
    prevArrow: <CustomPrevArrow />, // Custom left arrow
    nextArrow: <CustomNextArrow />, // Custom right arrow
    swipeToSlide: true, // Enable smooth swiping
    touchMove: true, // Allow touchpad swiping
    draggable: true, // Enable mouse dragging
    autoplay: false, // Default: no auto scroll
    autoplaySpeed: 3000, // Auto-scroll speed
    ...settings, // Override with custom settings
  };

  return (
    <div className="slide">
      <div className="container">
        <Slider {...defaultSettings}>{children}</Slider>
      </div>
    </div>
  );
};

export default Slide;
