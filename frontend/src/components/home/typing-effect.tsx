"use client"

import React, { useState, useEffect } from 'react';


export function TypingEffect({ 
  texts, className 
}: {
  texts: string[], className?: string
}) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const delay = 100;
  const deleteDelay = 50;
  const pauseDelay = 3000;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (currentIndex < texts.length) {
      const fullText = texts[currentIndex];
      
      if (!isDeleting) {
        if (charIndex < fullText.length) {
          timeout = setTimeout(() => {
            setCurrentText(prevText => prevText + fullText[charIndex]);
            setCharIndex(prevIndex => prevIndex + 1);
          }, delay);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
        }
      } else {
        if (charIndex > 0) {
          timeout = setTimeout(() => {
            setCurrentText(prevText => prevText.slice(0, -1));
            setCharIndex(prevIndex => prevIndex - 1);
          }, deleteDelay);
        } else {
          setIsDeleting(false);
          setCurrentIndex(prevIndex => (prevIndex + 1) % texts.length);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, texts, delay, deleteDelay, pauseDelay]);

  return <span className={className}>{currentText}</span>;
};

