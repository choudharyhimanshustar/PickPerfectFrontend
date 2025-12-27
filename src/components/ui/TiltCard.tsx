"use client";
import React, { useRef, useState } from "react";

const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Mouse position relative to center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Control tilt strength here
    const rotateX = (-y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;

    setStyle({
      transform: `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.02)
      `,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      {children}
    </div>
  );
};

export default TiltCard;