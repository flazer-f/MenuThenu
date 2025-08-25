import React from "react";
import "./Hero.css";
import Carousel from "./Carousel";
import Testimonials from "./Testimonials";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <Carousel />
        <div className="hero-overlay">
          <h1>Transform Your Restaurant with Interactive Digital Menus</h1>
          <p>
            MenuThenu offers a comprehensive suite of tools to streamline your
            menu management, customize layouts, and update in real-time.
          </p>
          <a href="#get-started" className="btn-primary">Get Started</a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section container">
        <h2>Key Features</h2>
        <div className="features">
          <div className="feature-card">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" alt="Convert Menus" />
            <h3>Convert Existing Menus</h3>
            <p>
              Digitize your existing paper menus quickly and efficiently,
              ensuring accessibility and visibility.
            </p>
          </div>
          <div className="feature-card">
            <img src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9" alt="Custom Templates" />
            <h3>Customizable Templates</h3>
            <p>
              Choose from a variety of templates to represent your brand
              effectively.
            </p>
          </div>
          <div className="feature-card">
            <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d" alt="Real-Time Updates" />
            <h3>Real-Time Updates</h3>
            <p>
              Instantly update your menus with new items, prices, or seasonal changes.
            </p>
          </div>
        </div>
      </section>

      <Testimonials/>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Elevate Your Menu Experience?</h2>
        <p>
          Contact us today to schedule a demo and see how MenuGenius can
          transform your restaurant.
        </p>
        <a href="#demo" className="btn-primary">Request a Demo</a>
      </section>
    </>
  );
}
