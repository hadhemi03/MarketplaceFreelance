import React, { useRef } from 'react';
import "./Home.scss";
import Featured from '../../components/featured/Featured.jsx';
import Slide from "../../components/Slide/Slide.jsx";
import { cards } from "../../data";
import CatCard from '../../components/catCard/CatCard.jsx';
import Navbar from 'components/navbar/Navbar'; // Make sure the import is correct
import checkICon from "../../assets/images/icons/check.png";
import contactUs from "../../assets/images/icons/contactus.jpg";

const Home = () => {
  const slideRef = useRef(null);
  const contactUsRef = useRef(null);

  const scrollToSlide = () => {
    if (slideRef.current) {
      slideRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContactUs = () => {
    contactUsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='home'>
      {/* Pass the scroll function to Navbar */}
      <Navbar onExploreClick={scrollToSlide} onContactUsClick={scrollToContactUs} />

      <Featured />

      <div ref={slideRef}>
        <Slide slidesToShow={5} arrowsScroll={3}>
          {cards.map((card) => (
            <CatCard card={card} key={card.id} />
          ))}
        </Slide>
      </div>

      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertips</h1>
            <div className="title">
              <img src={checkICon} alt="" />
              Find the perfect freelancer for your project
            </div>
            <p>
              Browse a curated selection of top talent, ready to bring your ideas to life.
            </p>
            <div className="title">
              <img src={checkICon} alt="" />
              Seamless collaboration, effortless communication
            </div>
            <p>
              Stay connected with real-time messaging and a shared calendar to manage projects efficiently.
            </p>
            <div className="title">
              <img src={checkICon} alt="" />
              Secure payments, guaranteed satisfaction
            </div>
            <p>
              Your funds are held safely and only released when you’re satisfied with the work.
            </p>
            <div className="title">
              <img src={checkICon} alt="" />
              Ratings that build trust
            </div>
            <p>
              Make informed hiring decisions with transparent freelancer ratings based on real client reviews.
            </p>
          </div>
          <div className="item">
            <img src="https://square-dz-static.s3.amazonaws.com/media/blog/freelance_small_very.jpg" />
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="features dark contact-us" ref={contactUsRef}>
        <div className="container">
          <div className="item">
            <h1>
              Get in Touch with <i>CollabWork</i>
            </h1>
            <h2>
              We're here to help with any questions, inquiries, or support you need.
            </h2>
            <p>
              Our team is ready to assist you with any of your questions, concerns, or feedback. Whether you're looking to partner with us, need support, or just want to say hello, feel free to reach out!
            </p>

            <div className="contact-info">
              <div className="title">
                <img src={checkICon} alt="" />
                <strong>Phone:</strong> +123 456 7890
              </div>

              <div className="title">
                <img src={checkICon} alt="" />
                <strong>Email:</strong> support@collabwork.com
              </div>

              <div className="title">
                <img src={checkICon} alt="" />
                <strong>Address:</strong> 123 Business St, City, Country
              </div>
            </div>
          </div>

          <div className="item">
            <img
              src={contactUs}
              alt="Contact Us"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
