import React from "react";
import "./App.css";

function App() {
  return (
    <div>
      {/* Navbar */}
      <header className="navbar container">
        <h1>MenuGenius</h1>
        <nav>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#get-started" className="btn-primary">Get Started</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="Restaurant tablet menu"
        />
        <div className="hero-overlay">
          <h1>Transform Your Restaurant with Interactive Digital Menus</h1>
          <p>
            MenuGenius offers a comprehensive suite of tools to streamline your
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
            <img
              src="https://via.placeholder.com/300x180"
              alt="Convert Menus"
            />
            <h3>Convert Existing Menus</h3>
            <p>
              Digitize your existing paper menus quickly and efficiently,
              ensuring accessibility and visibility.
            </p>
          </div>
          <div className="feature-card">
            <img
              src="https://via.placeholder.com/300x180"
              alt="Custom Templates"
            />
            <h3>Customizable Templates</h3>
            <p>
              Choose from a variety of templates to represent your brand
              effectively.
            </p>
          </div>
          <div className="feature-card">
            <img
              src="https://via.placeholder.com/300x180"
              alt="Real-Time Updates"
            />
            <h3>Real-Time Updates</h3>
            <p>
              Instantly update your menus with new items, prices, or
              seasonal changes.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section container">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <img
              src="https://via.placeholder.com/50"
              alt="Sophia Carter"
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
              src="https://via.placeholder.com/50"
              alt="David Brown"
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
              src="https://via.placeholder.com/50"
              alt="Olivia Hayes"
            />
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

      {/* Footer */}
      <footer>
        <p>
          <a href="#privacy">Privacy Policy</a> |{" "}
          <a href="#terms">Terms of Service</a> |{" "}
          <a href="#contact">Contact Us</a>
        </p>
        <p>© 2024 MenuGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
