import React from "react";
import "./Header.css";

export default function Header() {
  return (
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
  );
}
