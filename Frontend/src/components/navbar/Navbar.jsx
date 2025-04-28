import React, { useEffect, useState } from 'react';
import "./Navbar.scss";
import { Link, useLocation } from 'react-router-dom';
import Logo from 'components/logo/LogoMain';

const Navbar = ({ onExploreClick, onContactUsClick  }) => {
  const [active, setActive] = useState(false);
  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <span className="text1"><Logo /></span>
        </div>

        <div className="links">
         
          <span onClick={onExploreClick} className="explore-button">
            Explore
          </span>

          <span onClick={onContactUsClick} className="contact-us-button">
            Contact Us
          </span>


          <Link className="link" to="/login"><button className="nav-button">Login</button></Link>
          <Link className="link" to="/register"><button className="nav-button">Register</button></Link>
        </div>
      </div>

      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <span>Graphics & Design</span>
            <span>Digital Marketing</span>
            <span>Writing & Translation</span>
            <span>Video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
            <span>Business</span>
            <span>Legal & Compliance</span>
            <span>Data</span>
            <span>Photography</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
