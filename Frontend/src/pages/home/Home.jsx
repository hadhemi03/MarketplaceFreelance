import React from 'react'
import "./Home.scss"
import Featured from '../../components/featured/Featured.jsx';
import Slide from "../../components/Slide/Slide.jsx";
import { cards } from "../../data";
import CatCard from '../../components/catCard/CatCard.jsx';
import Navbar from 'components/navbar/Navbar';
import checkICon from "../../assets/images/icons/check.png";

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      <Featured />
      <Slide slidesToShow={5} arrowsScroll={3} >
        {cards.map((card) => (
          <CatCard card={card} key={card.id} />
        ))}

      </Slide>

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
              <img src={checkICon}  alt="" />
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
              <img src={checkICon}  alt="" />
              Ratings that build trust
            </div>
            <p>
              Make informed hiring decisions with transparent freelancer ratings based on real client reviews.
            </p>
          </div>
          <div className="item">
            <img src="https://square-dz-static.s3.amazonaws.com/media/blog/freelance_small_very.jpg"  />
          </div>
        </div>
      </div>
      
      

      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              CollabWork <i>business</i>
            </h1>
            <h1>
              A tailored solution designed for teams and businesses.
            </h1>
            <p>
              Upgrade to a seamless experience with powerful tools and benefits, dedicated to growing your business.
            </p>
            <div className="title">
              <img src={checkICon}  alt="" />
              Connect to freelancers with proven business experience
            </div>

            <div className="title">
              <img src={checkICon} alt="" />
              Get personalized matching with the right talent through our dedicated support.
            </div>

            <div className="title">
              <img src={checkICon}  alt="" />
              Enhance collaboration & productivity with an all-in-one workspace for managing projects efficiently.            </div>
            <button>Explore CollabWork Business</button>
          </div>
          <div className="item">
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624768/business-desktop-870-x2.png"
              alt=""
            />
          </div>
        </div>
      </div>



    </div>
  )
}

export default Home
