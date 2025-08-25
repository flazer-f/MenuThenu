import React from "react";
import "./Testimonials.css";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section container">
      <h2>What Our Customers Say</h2>
      <div className="testimonials">
        <div className="testimonial">
          <img
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39"
            alt="Sophia Carter"
            className="testimonial-photo"
          />
          <h4>Sophia Carter</h4>
          <p>⭐⭐⭐⭐⭐</p>
          <p>
            MenuGenius has revolutionized our restaurant’s customer experience.
            Easy to use and update!
          </p>
        </div>
        <div className="testimonial">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
            alt="David Brown"
            className="testimonial-photo"
          />
          <h4>David Brown</h4>
          <p>⭐⭐⭐⭐⭐</p>
          <p>
            Huge increase in engagement since switching. Real-time updates are a
            game changer.
          </p>
        </div>
        <div className="testimonial">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
            alt="Olivia Hayes"
            className="testimonial-photo"
          />
          <h4>Olivia Hayes</h4>
          <p>⭐⭐⭐⭐⭐</p>
          <p>
            The templates are perfect for our brand. The support team is
            amazing.
          </p>
        </div>
      </div>
    </section>
  );
}
