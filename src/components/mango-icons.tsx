
import React from 'react';

export const MangoIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 20C55 10 35 15 25 35C15 55 20 80 45 90C70 100 85 80 90 60C95 40 85 30 70 20Z" fill="#FFB300" />
    <path d="M70 20C75 10 85 10 90 5" stroke="#5DB800" strokeWidth="4" strokeLinecap="round" />
    <path d="M90 5C85 15 75 15 70 20" fill="#5DB800" opacity="0.8" />
    <path d="M60 40C65 35 75 35 80 40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export const LeafIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 22C2 22 10 21 16 15C22 9 22 2 22 2C22 2 15 2 9 8C3 14 2 22 2 22Z" fill="#5DB800" />
    <path d="M2 22L22 2" stroke="#4A9200" strokeWidth="1" />
  </svg>
);

export const SenegalFlag = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 900 600" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="600" fill="#00853f"/>
    <rect x="300" width="300" height="600" fill="#fdef42"/>
    <rect x="600" width="300" height="600" fill="#e31b23"/>
    <path d="m450 210 23.511 72.361h76.085l-61.554 44.721 23.511 72.361-61.553-44.722-61.553 44.722 23.511-72.361-61.554-44.721h76.085z" fill="#00853f"/>
  </svg>
);
