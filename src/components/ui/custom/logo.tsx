
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <Link
      to="/"
      className={`font-bold text-restaurant-700 flex items-center ${sizeClasses[size]} ${className}`}
    >
      <span className="italic">Benim</span>
      <span className="font-light">Restoranım</span>
    </Link>
  );
}
