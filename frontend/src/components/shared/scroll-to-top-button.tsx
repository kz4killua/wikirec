"use client"

import { useState, useEffect } from "react";


export function ScrollToTopButton() {

  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    setIsVisible(window.scrollY > 300)
  }

  function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
        window.removeEventListener('scroll', toggleVisibility);
    }
  }, [])

  return (
    <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 p-3 rounded-lg bg-blue-700 text-white shadow-md transition-transform transform ${
            isVisible ? 'translate-y-0' : 'translate-y-20'
        }`}
        style={{ transition: 'transform 0.3s ease-in-out' }}
    >
        ↑
    </button>
  );

}

