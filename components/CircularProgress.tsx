"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max: number;
  renderLabel?: (current: number, max: number) => React.ReactNode;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

const CircularProgress = ({
  value,
  max,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel = true,
  shape = "round",
  size = 120,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
}: CircularProgressProps) => {
  const radius = size / 2 - 10;
  const circumference = Math.ceil(3.14 * radius * 2);
  const percentage = Math.ceil(circumference * ((100 - (value / max) * 100) / 100));

  const viewBox = `-${size * 0.125} -${size * 0.125} ${size * 1.25} ${
    size * 1.25
  }`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
        className="relative"
      >
        {/* Base Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className={cn("stroke-gray-300", className)}
        />

        {/* Progress */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDashoffset={percentage}
          fill="transparent"
          strokeDasharray={circumference}
          className={cn("stroke-current", progressClassName)}
        />
        {/* Inner solid circle to improve label contrast */}
        {
          (() => {
            // compute a smaller inner circle radius so it sits comfortably inside the ring
            const maxStroke = Math.max(circleStrokeWidth || 0, progressStrokeWidth || 0);
            const innerRadius = Math.max(4, radius - maxStroke - 1);
            return (
              <circle
                r={innerRadius}
                cx={size / 2}
                cy={size / 2}
                className="fill-gray-200 stroke-gray-300"
                aria-hidden="true"
              />
            );
          })()
        }
      </svg>
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-center",
            labelClassName
          )}
        >
          {renderLabel ? renderLabel(value, max) : `${value}/${max}`}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
