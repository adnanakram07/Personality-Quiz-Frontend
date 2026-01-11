"use client";

import { useEffect, useState } from "react";

export default function ProgressNav({ currentIndex, total }) {
  const [displayIndex, setDisplayIndex] = useState(currentIndex);
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  // Update display index when currentIndex changes
  useEffect(() => {
    setDisplayIndex(currentIndex);
  }, [currentIndex]);

  const progressPercent =
    total > 1 ? (displayIndex / (total - 1)) * 100 : 0;

  const offset =
    circumference - (progressPercent / 100) * circumference;

  const labels = ["Name", "Age", "Email"];

  return (
    <div className="progress-nav">
      <div className="progress-circle">
        <svg viewBox="0 0 24 24">
          <circle
            className="circle-bg"
            cx="12"
            cy="12"
            r={radius}
          />
          <circle
            className="circle-progress"
            cx="12"
            cy="12"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
      </div>

      <div className="section-title">
        <span className="current-section">
          {labels[displayIndex] || labels[0]}
        </span>
      </div>

      <div className="percentage">
        {Math.round(progressPercent)}%
      </div>
    </div>
  );
}