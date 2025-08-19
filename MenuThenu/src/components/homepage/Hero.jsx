import React from "react";
import "./Hero.css";
import Carousel from "./Carousel";

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

      {/* Testimonials */}
      <section id="testimonials" className="section container">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <img src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39" alt="Sophia Carter" className="testimonial-photo" />
            <h4>Sophia Carter</h4>
            <p>⭐⭐⭐⭐⭐</p>
            <p>
              MenuGenius has revolutionized our restaurant’s customer experience.
              Easy to use and update!
            </p>
          </div>
          <div className="testimonial">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" alt="David Brown" className="testimonial-photo" />
            <h4>David Brown</h4>
            <p>⭐⭐⭐⭐⭐</p>
            <p>
              Huge increase in engagement since switching. Real-time updates are a
              game changer.
            </p>
          </div>
          <div className="testimonial">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" alt="Olivia Hayes" className="testimonial-photo" />
            <h4>Olivia Hayes</h4>
            <p>⭐⭐⭐⭐⭐</p>
            <p>
              The templates are perfect for our brand. The support team is amazing.
            </p>
          </div>
        </div>
      </section>

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
