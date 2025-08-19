import React, { useState } from "react";
import "./Header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar container">
      <h1>MenuThenu🍽️</h1>

      {/* Hamburger Button */}
      <button className="hamburger" onClick={toggleMenu}>
        <span className={isOpen ? "line open" : "line"}></span>
        <span className={isOpen ? "line open" : "line"}></span>
        <span className={isOpen ? "line open" : "line"}></span>
      </button>

      {/* Navigation */}
      <nav className={isOpen ? "nav-links open" : "nav-links"}>
        <ul>
          <li><a href="#features" onClick={() => setIsOpen(false)}>Features</a></li>
          <li><a href="#pricing" onClick={() => setIsOpen(false)}>Pricing</a></li>
          <li><a href="#testimonials" onClick={() => setIsOpen(false)}>Testimonials</a></li>
          <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
          <li>
            <a
              href="#get-started"
              className="btn-primary"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
