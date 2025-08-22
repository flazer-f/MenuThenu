import React, { useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = () => {
  const images = [
    "src/assets/c1.webp",
    "src/assets/c2.webp",
    "src/assets/c6.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="carousel-item" key={index}>
            <img src={img} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="carousel-btn prev"
        onClick={() =>
          setCurrentIndex(
            currentIndex === 0 ? images.length - 1 : currentIndex - 1
          )
        }
      >
        ❮
      </button>
      <button
        className="carousel-btn next"
        onClick={() =>
          setCurrentIndex(
            currentIndex === images.length - 1 ? 0 : currentIndex + 1
          )
        }
      >
        ❯
      </button>

      {/* Dots Navigation */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
